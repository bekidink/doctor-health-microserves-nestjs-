import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/interfaces/user.repository';
import { CreateUserUseCase } from '../use-cases/register-user.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { GetUsersUseCase } from '../use-cases/get-users.use-case';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.use-case';
import { CreateUserDto } from '../dtos/register-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    const useCase = new CreateUserUseCase(this.userRepository);
    return await useCase.execute(dto);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const useCase = new UpdateUserUseCase(this.userRepository);
    return await useCase.execute(id, dto);
  }

  async getAll(): Promise<User[]> {
    const useCase = new GetUsersUseCase(this.userRepository);
    return await useCase.execute();
  }

  async getById(id: string): Promise<User> {
    const useCase = new GetUserByIdUseCase(this.userRepository);
    return await useCase.execute(id);
  }
}
