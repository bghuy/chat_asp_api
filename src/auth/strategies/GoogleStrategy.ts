
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Profile, Strategy } from "passport-google-oauth20";
import { PrismaService } from "src/prisma/prisma.service";
import { ErrorType } from "src/utils/error";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService, private readonly prisma: PrismaService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email: profile.emails[0].value
                }
            })
            if(!existingUser) {
                await this.prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        password: '',
                        name: profile.displayName,
                        image: profile.photos[0].value,
                        emailVerified: new Date(),
                    }
                })
            }
            const tokens = await this.authService.validateGoogleUser({displayName: profile.displayName, email: profile.emails[0].value, photos: profile.photos})
            return tokens || null;
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}