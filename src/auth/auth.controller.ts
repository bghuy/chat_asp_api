import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { LocalGuard } from 'src/guards/local.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthService } from './auth.service';
import { signToken } from 'src/utils/jwt';
import { ErrorType } from 'src/utils/error';
import { UserRegisterDto } from 'src/dtos/user/UserRegisterDto';
import { GoogleGuard } from 'src/guards/Guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('status')
    @Roles(['ADMIN'])
    @UseGuards(JwtGuard, RoleGuard)
    status(@Req() req: Request) {
        return req.user;
    }

    @Get('refresh-token')
    @UseGuards(RefreshTokenGuard)
    refreshToken(@Req() req: Request, @Res() res: Response) {
        const access_token = signToken({user: req.user}, process.env.JWT_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
        if(!access_token) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        return res.json({ message: 'Refresh token successful', data:  {access_token} });
    }

    @Get('check-auth')
    @UseGuards(JwtGuard)
    checkAuth(@Req() req: Request) {
        return !!req.user;
    }

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Req() req: Request , @Res() res: Response) {
        const {access_token, refresh_token} = req.user as {access_token: string, refresh_token: string};
        const refreshTokenExpiry = parseInt(process.env.REFRESH_TOKEN_EXPIRY || '0', 10);
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: refreshTokenExpiry || sevenDaysInMs
        });
        return res.json({ message: 'Login successful', data: {access_token} });
    } 

    @Post('register')
    @UsePipes(ValidationPipe)
    async registerUser (@Body() newUserData: UserRegisterDto, @Res() res: Response) {
        const {email, password} = newUserData;
        const user = await this.authService.registerUser({email, password});
        if(!user) throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        return res.json({ message: 'User registered successfully' });
    }

    @Get('google/login')
    @UseGuards(GoogleGuard)
    handleGoogleLogin() {
        return "oke"
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    handleGoogleRedirect(@Req() req: Request) {
        return req.user;
    }


}
