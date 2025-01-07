import { Controller, Get, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ErrorType } from 'src/utils/error';
import { UserService } from './user.service';
import { UserServiceType } from 'src/utils/types/user';
import { CustomRequest } from 'src/utils/interfaces/request';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @UseGuards(JwtGuard)
    getProfile (@Req() req: CustomRequest) { 
        try {
            const user = req.user;
            const profile = this.userService.getUserProfile(user);
            return profile;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    } v
}
