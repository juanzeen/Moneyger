import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Revenue } from 'src/revenues/entities/revenue.entity';

export class UserDto {
  @ApiProperty()
  @IsString()
  name: string;

  //remover esse _hash sem falta!
  @IsString()
  @ApiProperty()
  password: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  revenues: Revenue[];

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  balance?: number;
}
