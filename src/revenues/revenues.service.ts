import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RevenueDto } from 'src/revenues/dto/RevenueDto';
import { Revenue } from './entities/revenue.entity';
import { Repository } from 'typeorm';
import { RevenueResponseDto } from './dto/RevenueResponsesDto';
import { UpdateRevenueDto } from './dto/UpdateRevenueDto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RevenuesService {
  constructor(
    @InjectRepository(Revenue)
    private revenuesRepository: Repository<Revenue>,
    private userService: UserService
  ) {}

  async getAll(): Promise<Revenue[]> {
    let revenues = await this.revenuesRepository.find();

    if (!revenues) {
      throw new NotFoundException()
    }

    return revenues
  }

  async getOne({ id }: { id: string }): Promise<RevenueResponseDto> {
    let revenue = await this.revenuesRepository.findOneBy({ id: id });
    if (revenue) return { data: revenue, msg: 'Success!' };

    throw new NotFoundException();
  }

  async createRevenue(revenueDto: RevenueDto, userId: string): Promise<RevenueResponseDto> {

    const dataWithUser =  { ...revenueDto}
    const revenue = await this.revenuesRepository.save(dataWithUser);

    return { data: revenue, msg: 'Created with success!' };

  }

  async deleteRevenue(id: string): Promise<RevenueResponseDto> {
    let revenue = await this.revenuesRepository.findOneBy({ id: id });

    if (revenue) {
      await this.revenuesRepository.delete({ id: id });
      return { data: revenue, msg: 'Deleted with success' };
    }

    throw new NotFoundException();
  }

  async updateRevenue(
    id: string,
    data: UpdateRevenueDto
  ): Promise<RevenueResponseDto> {
    await this.revenuesRepository.update(id, data);
    let updatedRevenue = await this.revenuesRepository.findOneBy({ id: id });
    if (!this.updateRevenue) {
      throw new NotFoundException();
    }
    return { data: updatedRevenue, msg: 'Updated with success!' };
  }
}
