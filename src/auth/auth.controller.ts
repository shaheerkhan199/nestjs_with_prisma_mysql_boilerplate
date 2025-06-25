import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/singup.dto';
import { VerifyOtpDto } from './dtos/verifyOtp.dto';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { AuthGuard } from './guards/auth.guard';

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

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() req,) {
    const userId: number = req.user.id;
    return this.authService.logout(userId);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    const userId: number = req.user.id;
    return this.authService.changePassword(userId, body);
  }

  @UseGuards(AuthGuard)
  @Post('reset-password')
  async resetPassword(@Request() req, @Body("password") password: string) {
    const userId: number = req.user.id;
    return this.authService.resetPassword(userId, password);
  }
}
