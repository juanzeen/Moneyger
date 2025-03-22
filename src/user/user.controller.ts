import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/UserDto';
import { User } from './entity/user.entity';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @ApiResponse({ status: 200, description: 'All the users are retrieved with their respective revenues.' })
  @Get("/")
  getUsers () : Promise<User[]> {
    return this.userService.getUsers();
  };

  @ApiResponse({ status: 200, description: 'The user with the match ID is retrieved.' })
  @ApiResponse({ status: 404, description: 'Not return any user, because the ID don\'t match any user.' })
  @Get("/:id")
  getUser (@Param('id') id : string) : Promise<User | null> {
    return this.userService.getUser(id);
  };

  @ApiResponse({ status: 201, description: 'The user with the specifed data is created.' })
  @Post("/create")
  @UsePipes(ValidationPipe)
  createUser(@Body() params: UserDto): Promise<User>  {
    console.log(params)
    return this.userService.createUser(params)
  }

  @ApiResponse({ status: 200, description: 'The user with the specifed ID is deleted.' })
  @ApiResponse({ status: 404, description: 'Not found any user with that ID.' })
  @Delete('/:id')
    deleteRevenue(@Param('id') id: string): Promise<DeleteResult>{
      return this.userService.deleteUser(id);
    }

    @ApiResponse({ status: 200, description: 'The user with the specifed ID was updated.' })
  @ApiResponse({ status: 404, description: 'Not found any user with that ID.' })
    @Put('/:id')
    @UsePipes(ValidationPipe)
    updateRevenue(
      @Param('id') id: string,
      @Body() data: UpdateUserDto,
    ): Promise<User | null>{
      return this.userService.updateUser(id, data);
    }
}
