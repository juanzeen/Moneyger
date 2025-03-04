import { IsString, IsNumber, isArray, NotEquals, IsArray, ArrayMinSize, Equals } from 'class-validator';
import { RevenueDto } from './RevenueDto';

export class RevenueResponseDto{

  @Equals(RevenueDto)
  data: RevenueDto | null

  @IsString()
  msg: string;

}
