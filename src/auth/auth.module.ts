import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwtdata/secret';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '360000s' },
      secret:
        jwtConstants.secret
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
