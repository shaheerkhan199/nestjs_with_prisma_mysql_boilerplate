import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  // imports: [
  //   // UsersModule,
  //   forwardRef(() => UsersModule),
  //   JwtModule.register({
  //     secret: 'JWT_SECRET', // use config service or env
  //     signOptions: { expiresIn: '3d' },
  //   }),
  // ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '3d'),
        },
      }),
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule { }
