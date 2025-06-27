import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
