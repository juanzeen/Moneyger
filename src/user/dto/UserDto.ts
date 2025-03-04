import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Revenue } from 'src/revenues/entities/revenue.entity';

export class UserDto {
  @IsString()
  name: string;

  //remover esse _hash sem falta!
  @IsString()
  password: string;

  @IsArray()
  @IsOptional()
  revenues: Revenue[];

  @IsNumber()
  @IsOptional()
  balance?: number;
}
