import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/AuthDto';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async login(@Body() data: AuthDto): Promise<AuthResponseDto>{
    return this.authService.signIn(data.name, data.password)
  }
  @UseGuards(AuthGuard)
  @Get("/profile")
  getProfile(@Request() req) {
    return this.authService.getProfile(req)
  }

}
