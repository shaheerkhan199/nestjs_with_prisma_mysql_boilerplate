import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
    }

    try {
      const JWT_SECRET: string = this.configService.get("JWT_SECRET")!
      const payload = this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });
      (request as any).user = payload
    } catch (err) {
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
