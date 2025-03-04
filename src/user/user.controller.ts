import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/UserDto';
import { User } from './entity/user.entity';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {

  //implementando o service para que seja possível injetar as funções provenientes dele
  constructor(private readonly userService: UserService){}

  //quando declaramos o modulo, automaticamente o nome dele ja é colocado como prefixo da nossa rota
  //ou seja, para acessarmos esse get precisamos da rota "/user/{user_id}"
  @Get("/")
  getUsers () : Promise<User[]> {
    return this.userService.getUsers();
  };
  @Get("/:id")
  getUser (@Param('id') id : string) : Promise<User | null> {
    return this.userService.getUser(id);
  };

  @Post("/create")
  @UsePipes(ValidationPipe)
  createUser(@Body() params: UserDto): Promise<User>  {
    console.log(params)
    return this.userService.createUser(params)
  }

  @Delete('/:id')
    deleteRevenue(@Param('id') id: string): Promise<DeleteResult>{
      return this.userService.deleteUser(id);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    updateRevenue(
      @Param('id') id: string,
      @Body() data: UserDto,
    ): Promise<User | null>{
      return this.userService.updateUser(id, data);
    }
}
