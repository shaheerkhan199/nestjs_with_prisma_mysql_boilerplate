import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/singup.dto';
import { VerifyOtpDto } from './dtos/verifyOtp.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string, fcmToken?: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (body.fcmToken) {
      this.userService.updateUser(user.id, { fcmToken: body.fcmToken })
    }
    return this.authService.login(user);
  }

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

}
