import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthPayloadParams,GoogleUserDetails,UserRegisterType } from 'src/utils/types/auth';
import { Prisma } from '@prisma/client';
import { error } from 'console';
import { ErrorType } from 'src/utils/error';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private readonly prisma: PrismaService) { }

    async validateUser({email, password}: AuthPayloadParams) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email
                }
            });
            if(!existingUser) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }
            const isSamePassword = await comparePassword(password, existingUser.password);
            if(isSamePassword) {
                const {password,emailVerified, ...user} = existingUser;
                return {
                    access_token: this.jwtService.sign({user}),
                    refresh_token: this.jwtService.sign(
                        {user}, 
                        {expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET}
                    ),
                } 
            }
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async registerUser (user: UserRegisterType) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email: user.email
                }
            })
            if(existingUser) {
                throw new HttpException(ErrorType.USER_EXIST, HttpStatus.CONFLICT);
            }
            const hashedPassword = await hashPassword(user.password)
            return this.prisma.user.create({
                data: {
                    ...user,
                    password: hashedPassword
                }
            })

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async validateGoogleUser(userDetails: GoogleUserDetails) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: userDetails.email
            }
        })
        if(existingUser) {
            return existingUser;
        }
        const user = await this.prisma.user.create({
            data: {
                email: userDetails.email,
                name: userDetails.displayName,
            }
        })
        const {password, ...userData} = user;
        return userData
    } 
}
