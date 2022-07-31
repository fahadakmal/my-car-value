import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepositery: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const user = await this.userRepositery.create({ email, password });
    return await this.userRepositery.save(user);
  }

  async findOne(id: number) {
    const user = this.userRepositery.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not founds');
    }
    return user;
  }

  async find(email: string) {
    return this.userRepositery.find({ where: { email: email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not founds');
    }
    Object.assign(user, attrs);
    return this.userRepositery.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not founds');
    }
    return this.userRepositery.remove(user);
  }
}
