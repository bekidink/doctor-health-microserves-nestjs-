import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/interfaces/service.repository';

export class GetServicesUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(): Promise<Service[]> {
    return await this.serviceRepository.findAll();
  }
}
