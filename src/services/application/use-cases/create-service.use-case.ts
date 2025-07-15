import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/interfaces/service.repository';
import { CreateServiceDto } from '../dtos/create-service.dto';
import { ServiceCode } from '../../domain/value-objects/service-code.vo';
import { ServiceName } from '../../domain/value-objects/service-name.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';
import {
  ServiceExistsError,
  InvalidImageUrlError,
  InvalidPriceError,
} from '../../domain/errors/domain.error';
import { v4 as uuidv4 } from 'uuid';

export class CreateServiceUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(dto: CreateServiceDto): Promise<Service> {
    const code = new ServiceCode(dto.code);
    const name = new ServiceName(dto.name);
    const existing = await this.serviceRepository.findByCode(dto.code);
    if (existing) throw new ServiceExistsError(dto.code);

    let imageUrl: string | null = null;
    if (dto.imageUrl) {
      try {
        imageUrl = new ImageUrl(dto.imageUrl).value;
      } catch {
        throw new InvalidImageUrlError();
      }
    }

    if (dto.price <= 0) throw new InvalidPriceError();

    const service = new Service(
      uuidv4(),
      dto.code,
      dto.name,
      dto.description!,
      imageUrl,
      dto.price,
      dto.duration!,
    );
    await this.serviceRepository.save(service);
    return service;
  }
}
