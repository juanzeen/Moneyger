import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RevenuesService } from './revenues.service';
import { RevenueDto } from 'src/revenues/dto/RevenueDto';
import { Revenue } from './entities/revenue.entity';
import { RevenueResponseDto } from './dto/RevenueResponsesDto';
import { UpdateRevenueDto } from './dto/UpdateRevenueDto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('revenues')
export class RevenuesController {
  //injeção de dependencias
  constructor(private readonly RevenuesService: RevenuesService) {}

  @Get('/')
  getAll(): Promise<Revenue[]> {
    return this.RevenuesService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Promise<RevenueResponseDto> {
    return this.RevenuesService.getOne({ id });
  }

  @Post('/')
  //adiciona uma validação automática baseada no dto
  //podemos passar a instancia pré definida ou instanciar uma manualmente
  //a utilidade de instanciar uma nova clase de ValidationPipe é personalizar determinados campos
  @UsePipes(ValidationPipe)
  createRevenue(
    @Body() data: RevenueDto,
    @Request() req,
  ): Promise<RevenueResponseDto> {
    return this.RevenuesService.createRevenue(data, req.user.sub);
  }

  @Delete('/:id')
  deleteRevenue(
    @Param('id') id: string,
    @Request() req,
  ): Promise<RevenueResponseDto> {
    return this.RevenuesService.deleteRevenue(id, req.user.sub);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateRevenue(
    @Param('id') id: string,
    @Request() req,
    @Body() data: UpdateRevenueDto,
  ): Promise<RevenueResponseDto> {
    return this.RevenuesService.updateRevenue(id, req.user.sub, data);
  }
}
