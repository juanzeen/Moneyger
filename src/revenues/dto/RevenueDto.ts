import { IsString, IsNumber, NotEquals, IsArray, IsOptional } from 'class-validator';

export class RevenueDto {
  @IsString()
  name: string;

  @IsNumber()
  @NotEquals(0)
  value: number;

  @IsString()
  type: "in" | "out"

  @IsArray()
  @IsOptional()
  tags?: string[];
}
