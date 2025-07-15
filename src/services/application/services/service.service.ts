import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/interfaces/service.repository';
import { CreateServiceUseCase } from '../use-cases/create-service.use-case';
import { UpdateServiceUseCase } from '../use-cases/update-service.use-case';
import { GetServicesUseCase } from '../use-cases/get-services.use-case';
import { CreateServiceDto } from '../dtos/create-service.dto';
import { UpdateServiceDto } from '../dtos/update-service.dto';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(private serviceRepository: ServiceRepository) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const useCase = new CreateServiceUseCase(this.serviceRepository);
    return await useCase.execute(dto);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const useCase = new UpdateServiceUseCase(this.serviceRepository);
    return await useCase.execute(id, dto);
  }

  async getAll(): Promise<Service[]> {
    const useCase = new GetServicesUseCase(this.serviceRepository);
    return await useCase.execute();
  }
}
