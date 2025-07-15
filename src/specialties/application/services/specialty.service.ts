import { Injectable } from '@nestjs/common';
import { SpecialtyRepository } from '../../domain/interfaces/specialty.repository';
import { CreateSpecialtyUseCase } from '../use-cases/create-specialty.use-case';
import { UpdateSpecialtyUseCase } from '../use-cases/update-specialty.use-case';
import { GetSpecialtiesUseCase } from '../use-cases/get-specialties.use-case';
import { AssignSpecialtyUseCase } from '../use-cases/assign-specialty.use-case';
import { CreateSpecialtyDto } from '../dtos/create-specialty.dto';
import { UpdateSpecialtyDto } from '../dtos/update-specialty.dto';
import { AssignSpecialtyDto } from '../dtos/assign-specialty.dto';
import { Specialty } from '../../domain/entities/specialty.entity';
import { UserRepository } from '../../../user-management/domain/interfaces/user.repository';

@Injectable()
export class SpecialtyService {
  constructor(
    private specialtyRepository: SpecialtyRepository,
    private userRepository: UserRepository,
  ) {}

  async create(dto: CreateSpecialtyDto): Promise<Specialty> {
    const useCase = new CreateSpecialtyUseCase(this.specialtyRepository);
    return await useCase.execute(dto);
  }

  async update(id: string, dto: UpdateSpecialtyDto): Promise<Specialty> {
    const useCase = new UpdateSpecialtyUseCase(this.specialtyRepository);
    return await useCase.execute(id, dto);
  }

  async getAll(): Promise<Specialty[]> {
    const useCase = new GetSpecialtiesUseCase(this.specialtyRepository);
    return await useCase.execute();
  }

  async assignToDoctor(dto: AssignSpecialtyDto): Promise<void> {
    const useCase = new AssignSpecialtyUseCase(
      this.specialtyRepository,
      this.userRepository,
    );
    return await useCase.execute(dto);
  }
}
