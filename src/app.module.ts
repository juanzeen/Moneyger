import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RevenuesModule } from './revenues/revenues.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Revenue } from './revenues/entities/revenue.entity';
import { User } from './user/entity/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    RevenuesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'moneyger',
      entities: [Revenue, User],
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
