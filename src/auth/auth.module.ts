import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    // UsersModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: 'JWT_SECRET', // use config service or env
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule { }
