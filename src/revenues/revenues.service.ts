import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RevenueDto } from 'src/revenues/dto/RevenueDto';
import { Revenue } from './entities/revenue.entity';
import { Repository } from 'typeorm';
import { RevenueResponseDto } from './dto/RevenueResponsesDto';
import { UpdateRevenueDto } from './dto/UpdateRevenueDto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RevenuesService {
  constructor(
    @InjectRepository(Revenue)
    private revenuesRepository: Repository<Revenue>,
    @InjectDataSource()
    private dataSource: DataSource,
    private userService: UserService,
  ) {}

  async getAll(): Promise<Revenue[]> {
    let revenues = await this.revenuesRepository.find();

    if (!revenues) {
      throw new NotFoundException();
    }

    return revenues;
  }

  async getOne({ id }: { id: string }): Promise<RevenueResponseDto> {
    let revenue = await this.revenuesRepository.findOneBy({ id: id });
    if (revenue) return { data: revenue, msg: 'Success!' };

    throw new NotFoundException();
  }

  async createRevenue(
    revenueDto: RevenueDto,
    userId: string,
  ): Promise<RevenueResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const user = await this.userService.getUser(userId);
      const { name, value, type } = revenueDto;

      if (!user) {
        throw new NotFoundException();
      }

      const updatedBalance = this.applyInBalance(user.balance, value, type);

      if (updatedBalance < 0) {
        throw new BadRequestException();
      }

      const toUpdateUser = manager.create(User, {
        ...user,
        balance: updatedBalance,
      });

      const updatedUser = await manager.save(toUpdateUser);

      const createdRevenue = manager.create(Revenue, {
        name,
        value,
        type,
        user: updatedUser,
      });

      const revenue = await manager.save(createdRevenue);

      return { data: revenue, msg: 'Created with success!' };
    });
  }

  async deleteRevenue(id: string, userId: string): Promise<RevenueResponseDto> {
    let revenue = await this.revenuesRepository.findOneBy({ id: id });

    if (revenue) {
      await this.revenuesRepository.delete({ id: id });
      return { data: revenue, msg: 'Deleted with success' };
    }

    throw new NotFoundException();
  }

  async updateRevenue(
    id: string,
    userId: string,
    data: UpdateRevenueDto,
  ): Promise<RevenueResponseDto> {
    if (data.type != undefined && typeof data.value != undefined) {
      return await this.dataSource.transaction(async (manager) => {
        const user = await this.userService.getUser(userId);

        if (!user) {
          throw new UnauthorizedException();
        }

        const updatedBalance = this.applyInBalance(
          user.balance,
          data.value!,
          data.type!,
        );

        if (updatedBalance < 0) {
          throw new BadRequestException();
        }

        const toUpdateUser = manager.create(User, {
          ...user,
          balance: updatedBalance,
        });

        const updatedUser = await manager.save(toUpdateUser);

        const oldRevenue = await this.getOne({ id });

        const toUpdateRevenue = { ...oldRevenue, data };

        const updatedRevenue = manager.create(Revenue, {
          toUpdateRevenue,
          user: updatedUser,
        });

        const revenue = await manager.save(updatedRevenue);

        return { data: revenue, msg: 'Updated with success!' };
      });
    }

    await this.revenuesRepository.update(id, data);
    let updatedRevenue = await this.revenuesRepository.findOneBy({ id: id });
    if (!this.updateRevenue) {
      throw new NotFoundException();
    }
    return { data: updatedRevenue, msg: 'Updated with success!' };
  }

  applyInBalance(balance: number, value: number, type: 'in' | 'out'): number {
    if (type == 'out') {
      return balance - value;
    }

    return balance + value;
  }
}
