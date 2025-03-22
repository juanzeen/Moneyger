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

  async getAll(userId: string): Promise<Revenue[]> {
    const user = await this.userService.getUser(userId)

    if (!user) {
      throw new UnauthorizedException()
    }
    const revenues = await this.revenuesRepository.findBy({user: user});

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
        throw new UnauthorizedException();
      }

      const updatedBalance = this.applyInBalance(
        user.balance,
        value,
        type,
        'upsert',
      );

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
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new UnauthorizedException()
    }

    if (revenue && user) {
      const balanceAfterDelete = this.applyInBalance(
        user.balance,
        revenue.value,
        revenue.type,
        'delete',
      );

      if (balanceAfterDelete < 0) {
        throw new BadRequestException()
      }

      this.userService.updateUser(userId, {
        ...user,
        balance: balanceAfterDelete,
      });

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
    return await this.dataSource.transaction(async (manager) => {
      const user = await this.userService.getUser(userId);
      const oldRevenue = await this.getOne({ id });

      if (!oldRevenue.data) {
        throw new NotFoundException();
      }

      if (!user) {
        throw new UnauthorizedException();
      }

      if (data.type || data.value ) {
        //retornando o valor do usuário antes do upsert da receita
        const currentBalance = oldRevenue.data.type === "in" ? user.balance - oldRevenue.data.value : user.balance + oldRevenue.data.value
        //atualiza de fato o valor antes do upsert
        const updatedBalance = this.applyInBalance(
          currentBalance,
          data.value ?? oldRevenue.data.value,
          data.type ?? oldRevenue.data.type,
          'upsert',
        );

        if (updatedBalance < 0) {
          throw new BadRequestException();
        }

        const toUpdateUser = manager.create(User, {
          ...user,
          balance: updatedBalance,
        });

        await manager.save(toUpdateUser);
      }

      await this.revenuesRepository.update(id, data);
      const revenue = (await this.getOne({ id })).data;

      return { data: revenue, msg: 'Updated with success!' };
    });
  }

  applyInBalance(
    balance: number,
    value: number,
    type: 'in' | 'out',
    operation: 'upsert' | 'delete',
  ): number {
    switch (operation) {
      case 'upsert':
        if (type == 'out') {
          return balance - value;
        }
        return balance + value;
        break;
      case 'delete':
        if (type == 'out') {
          return balance + value;
        }
        return balance - value;
        break;
    }
  }
}
