import {UserRole } from "@prisma/client"

export type UserServiceType = {
    id: string,
    name: string,
    email: string,
    emailVerified?: Date | string;
    image?: string | null,
    role: UserRole,
    createdAt?: Date | string,
    updatedAt?: Date | string
}