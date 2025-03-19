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
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';


@UseGuards(AuthGuard)
  @ApiHeader({name: 'Bearer Token', description: 'JWT token used to only connected users be aple to manipulate revenues.'})
@Controller('revenues')
export class RevenuesController {
  //injeção de dependencias
  constructor(private readonly RevenuesService: RevenuesService) {}

  @ApiResponse({ status: 200, description: 'All the revenues are retrieved with their respective user.' })
  @Get('/')
  getAll(): Promise<Revenue[]> {
    return this.RevenuesService.getAll();
  }

  @ApiResponse({ status: 200, description: 'The revenue with the specifed ID is retrieved.' })
  @ApiResponse({ status: 404, description: 'Not found any revenue with that ID.' })
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<RevenueResponseDto> {
    return this.RevenuesService.getOne({ id });
  }
  @ApiResponse({ status: 201, description: 'The revenue with the specifed data is created.' })
  @ApiResponse({ status: 400, description: 'The revenue will put the user balance negative' })
  @ApiResponse({ status: 401, description: 'User not authenticated.' })
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
  @ApiResponse({ status: 201, description: 'The revenue with the specifed data is deleted.' })
  @ApiResponse({ status: 400, description: 'The delete of this revenue will put the user balance negative.' })
  @ApiResponse({ status: 401, description: 'User not authenticated.' })
  @ApiResponse({ status: 404, description: 'Revenue not founded.' })

  @Delete('/:id')
  deleteRevenue(
    @Param('id') id: string,
    @Request() req,
  ): Promise<RevenueResponseDto> {
    return this.RevenuesService.deleteRevenue(id, req.user.sub);
  }
  @ApiResponse({ status: 201, description: 'The revenue with the specifed data is deleted.' })
  @ApiResponse({ status: 400, description: 'The update of this revenue will put the user balance negative.' })
  @ApiResponse({ status: 401, description: 'User not authenticated.' })
  @ApiResponse({ status: 404, description: 'Revenue not founded.' })
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
