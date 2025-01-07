import { UserRole } from "@prisma/client";

export interface AuthenticatedUser {
    id: string;
    name: string | null;
    email: string;
    emailVerified?: Date | null;
    image?: string | null;
    role: UserRole;
    createdAt?: Date | string
    updatedAt?: Date | string
}