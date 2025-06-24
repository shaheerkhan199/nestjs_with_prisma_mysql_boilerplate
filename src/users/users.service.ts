import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserParams } from 'src/utils/types';
import { User } from '@prisma/client';
import { generateOTP } from 'src/utils/generateOtp';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  
  async createUser(body: CreateUserParams) {
    const { email, password, country, fcmToken, firstName, lastName } = body
    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    return this.prisma.user.create({
      data: {
        roleId: 1,
        email,
        password: hashed,
        fcmToken,
        resetToken: otp.toString(),
        resetTokenExpiry: new Date()
      },
      select: {
        id: true,
        email: true,
        status: true,
      }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(userId: number, data: Partial<User>) {
  return this.prisma.user.update({
    where: { id: userId },
    data,
  });
}


}
