import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) { }


  @UseGuards(AuthGuard)
  @Get('me')
  async getMyProfile(@Req() req) {
    const userId: number = req.user.id;
    return this.userService.getUserProfile(userId);
  }
}
