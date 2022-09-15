import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest();
    const authHeader = headers.authorization;

    if (authHeader) {
      const [bearer, accessToken] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !accessToken) return false;

      await this.authService.verifyAccessToken(accessToken);

      return true;
    }

    return false;
  }
}
