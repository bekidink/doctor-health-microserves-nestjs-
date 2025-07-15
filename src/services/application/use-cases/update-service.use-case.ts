import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/interfaces/service.repository';
import { UpdateServiceDto } from '../dtos/update-service.dto';
import {
  ServiceNotFoundError,
  ServiceExistsError,
  InvalidImageUrlError,
  InvalidPriceError,
} from '../../domain/errors/domain.error';
import { ServiceCode } from '../../domain/value-objects/service-code.vo';
import { ServiceName } from '../../domain/value-objects/service-name.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';

export class UpdateServiceUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) throw new ServiceNotFoundError(id);

    let updatedCode = service.code;
    if (dto.code && dto.code !== service.code) {
      const existing = await this.serviceRepository.findByCode(dto.code);
      if (existing) throw new ServiceExistsError(dto.code);
      updatedCode = new ServiceCode(dto.code).value;
    }

    const updatedName = dto.name
      ? new ServiceName(dto.name).value
      : service.name;
    const updatedDescription =
      dto.description !== undefined ? dto.description : service.description;

    let updatedImageUrl = service.imageUrl;
    if (dto.imageUrl !== undefined) {
      try {
        updatedImageUrl = dto.imageUrl
          ? new ImageUrl(dto.imageUrl).value
          : null;
      } catch {
        throw new InvalidImageUrlError();
      }
    }

    const updatedPrice =
      dto.price !== undefined
        ? dto.price <= 0
          ? service.price
          : dto.price
        : service.price;
    if (dto.price !== undefined && dto.price <= 0)
      throw new InvalidPriceError();

    const updatedDuration =
      dto.duration !== undefined ? dto.duration : service.duration;

    const updatedService = new Service(
      service.id,
      updatedCode,
      updatedName,
      updatedDescription,
      updatedImageUrl,
      updatedPrice,
      updatedDuration,
      service.createdAt,
      new Date(), // Update timestamp
    );

    await this.serviceRepository.update(updatedService);
    return updatedService;
  }
}
