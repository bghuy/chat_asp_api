import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { Roles } from "./../decorators/roles.decorator";


@Injectable()
export class RoleGuard implements CanActivate{

    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>(Roles, context.getHandler());
        if(!roles) return true;
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as { role: string };
        if (!user || !user?.role) {
            return false;
        }
        const hasRole = roles.includes(user.role);
        return hasRole;
    }
}