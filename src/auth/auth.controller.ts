import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/AuthDto';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { AuthGuard } from './auth.guard';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @ApiResponse({status: 201, description: "Generate a JWT token based in the user infos (name and password)"})
  @HttpCode(HttpStatus.CREATED)
  @Post("/login")
  async login(@Body() data: AuthDto): Promise<AuthResponseDto>{
    return this.authService.signIn(data.name, data.password)
  }
  @UseGuards(AuthGuard)
    @ApiHeader({name: "Bearer token", description: "JWT token"})
  @ApiResponse({status: 200, description: "Get the user infos using the header of the requisition. Only for users who passes the Bearer JWT token."})
  @Get("/profile")
  getProfile(@Request() req) {
    return this.authService.getProfile(req)
  }

}
