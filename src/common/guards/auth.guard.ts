import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const { headers } = context.switchToHttp().getRequest();
    const authHeader = headers.authorization;

    if (authHeader) {
      const [type, accessToken] = authHeader.split(' ');

      if (type !== 'Bearer' || !accessToken) return false;

      await this.authService.verifyAccessToken(accessToken);

      return true;
    }

    return false;
  }
}
