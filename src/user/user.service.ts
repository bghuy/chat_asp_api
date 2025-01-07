import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserServiceType } from 'src/utils/types/user';
@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async getUserProfile(user: UserServiceType) {
        return await this.prisma.user.findUnique({
            where: {
                email: user.email,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                emailVerified: true,
                image: true,
            }
        });
    }
}
