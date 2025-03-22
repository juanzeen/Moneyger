import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<AuthResponseDto> {
    const user = await this.userService.getUserByName(username);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password_hash);
      if (isMatch) {
        return {
          name: user.name,
          id: user.id,
          access_token: await this.jwtService.signAsync({
            sub: user.id,
            username: user.name,
          }),
        };
      }

      throw new UnauthorizedException();
    }

    throw new NotFoundException();
  }

  async getProfile(request) {
    return request.user
  }
}
