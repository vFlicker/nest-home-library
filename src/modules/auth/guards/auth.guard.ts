import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader) {
      const [bearer, accessToken] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException();
      }

      request.user = this.authService.verifyAccessToken(accessToken);

      return true;
    }

    throw new UnauthorizedException();
  }
}
