import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangePasswordParams, CreateUserParams, VerifyOtpParams } from 'src/utils/types';
import { generateOTP } from 'src/utils/generateOtp';
import * as moment from "moment";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    // throw new UnauthorizedException('Invalid credentials');
    throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST);
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(body: CreateUserParams) {
    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) {
      throw new HttpException('Email is already in use', HttpStatus.BAD_REQUEST);
      // throw new BadRequestException('Email is already in use');
    }

    const user = await this.usersService.createUser(body);
    return user;
  }

  async sendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // throw new NotFoundException('User not found');
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    const updatedUser = await this.usersService.updateUser(user.id, {
      resetToken: otp,
      resetTokenExpiry: expiry,
    });

    // Send via email/SMS here (stubbed for now)
    console.log(`OTP for ${email}: ${otp}`);

    return { message: 'OTP sent successfully', user: updatedUser };
  }

  async verifyOtp({ email, otp }: VerifyOtpParams) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (
      user.resetToken !== otp ||
      !user.resetTokenExpiry
      // user.resetTokenExpiry < new Date()
    ) {
      throw new BadRequestException('Invalid OTP');
    }

    // check for otp expiry
    const otpCreated = moment(user.resetTokenExpiry)
    const dateNow = moment(Date.now())
    const DiffInMins = dateNow.diff(otpCreated, 'minutes')
    if (DiffInMins > 10) {
      // check for expiry
      throw new BadRequestException('OTP is expired.');
    }


    const updatedUser = await this.usersService.updateUser(user.id, {
      status: 'ACTIVE',
      resetToken: null,
      resetTokenExpiry: null,
    });


    const loginResponse = await this.login(updatedUser)

    return { data: loginResponse, message: 'OTP verified successfully, user activated' };
  }

  async logout(userId: number) {
    await this.usersService.updateUser(userId, { fcmToken: null })
    return { message: 'User Logout successfully', data: {} };
  }

  async changePassword(userId: number, body: ChangePasswordParams) {
    const { currentPassword, newPassword } = body;

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.usersService.updateUser(userId, {
      password: hashed,
    });

    return { message: 'Password changed successfully', data: {} };
  }

  async resetPassword(userId: number, password: string) {

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const hashed = await bcrypt.hash(password, 10);

    await this.usersService.updateUser(userId, {
      password: hashed,
    });

    return { message: 'Password reset successfully', data: {} };
  }

}
