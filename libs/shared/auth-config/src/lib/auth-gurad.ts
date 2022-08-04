import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        return this.validateRequest({ request, roles });
    }

    validateRequest<T>(request: T): boolean {
        return request ? true : false;
    }
}
