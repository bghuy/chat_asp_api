import { Account, Channel, MemberRole, Server, UserRole } from "@prisma/client";

export type AuthPayloadParams = {
    email: string;
    password: string;
}

export type UserRegisterType = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    password: string | null
    role?: UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
}

export type GoogleUserDetails = {
    email: string;
    displayName: string;
}



