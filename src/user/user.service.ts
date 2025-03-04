import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/UserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User)
  private userRepository: Repository<User>) { }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({relations: ['revenues']})
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: id })
    if (user) {
      return user
    }
    throw new NotFoundException()
  }

  async getUserByName(name: string): Promise<User>{
    const user = await this.userRepository.findOneBy({name: name})
    if (user) {
      return user
    }

    throw new NotFoundException()
  }

  async createUser(data: UserDto): Promise<User> {
    const salts = 10;
    const { password } = data
    const hash = await bcrypt.hash(password, salts)
    const userWithHash = {
      name: data.name,
      password_hash: hash,
      revenues: data.revenues
    }
    return await this.userRepository.save(userWithHash)
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    let user = await this.userRepository.findOneBy({ id: id })
    if (user) {
      return await this.userRepository.delete(id)
    }

    throw new NotFoundException()
  }

  async updateUser(id: string, data: UserDto): Promise<User | null> {
    this.userRepository.update(id, data)
    let updatedUser = this.userRepository.findOneBy({ id: id })
    if (updatedUser) {
      return updatedUser
    }

    throw new NotFoundException()

  }
}
