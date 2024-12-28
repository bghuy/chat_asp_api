import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleStrategy } from './strategies/GoogleStrategy';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    }),
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy, LocalStrategy, GoogleStrategy],
  exports: [AuthService]
})
export class AuthModule {}
