import { Module } from '@nestjs/common';
import { RevenuesService } from './revenues.service';
import { RevenuesController } from './revenues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Revenue } from './entities/revenue.entity';
import { User } from 'src/user/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

//TODO: when delete revenues, the value of her needs to be summed or diminished in user balance
@Module({
  imports: [TypeOrmModule.forFeature([Revenue, User]), AuthModule, UserModule],
  providers: [RevenuesService],
  controllers: [RevenuesController]
})
export class RevenuesModule {}
