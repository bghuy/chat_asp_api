import { UserRole } from "@prisma/client"
import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class UserRegisterDto {
    name?: string | null

    @IsNotEmpty()
    @IsEmail()
    email: string

    emailVerified?: Date | string | null
    image?: string | null

    @IsNotEmpty()
    @MinLength(6)
    password: string | null

    role?: UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
}