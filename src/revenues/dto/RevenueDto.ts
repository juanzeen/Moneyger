import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, NotEquals, IsArray, IsOptional } from 'class-validator';

export class RevenueDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @NotEquals(0)
  value: number;

  @ApiProperty()
  @IsString()
  type: "in" | "out"

  @ApiProperty({type: [String]})
  @IsArray()
  @IsOptional()
  tags?: string[];
}
