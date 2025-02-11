import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        try {
            console.log('Connecting to the database...');
            await this.$connect();
            console.log('Connected to the database');
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }
    async beforeApplicationShutdown() {
        try {
            console.log('Closing connection to the database...');
            await this.$disconnect();
            console.log('Connection to the database closed');
        } catch (error) {
            console.error('Error closing connection to the database:', error);
        }
        
    }
}
