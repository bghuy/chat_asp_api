import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {} 
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refresh_token']; 
    console.log(refreshToken,"refresh_token");
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing or invalid.');
    }
    const decoded = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET});
    if(!decoded || !decoded?.user) throw new UnauthorizedException('Refresh token is missing or invalid.');
    request.user = decoded.user;
    return true;
  }
}
