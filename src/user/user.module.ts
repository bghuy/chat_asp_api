import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { jwtStrategy } from './../auth/strategies/jwt.strategy';
import { PrismaModule } from './../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService,jwtStrategy],
  controllers: [UserController]
})
export class UserModule {}
