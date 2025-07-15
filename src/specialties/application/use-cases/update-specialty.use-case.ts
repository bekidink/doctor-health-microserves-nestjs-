import { Specialty } from '../../domain/entities/specialty.entity';
import { SpecialtyRepository } from '../../domain/interfaces/specialty.repository';
import { UpdateSpecialtyDto } from '../dtos/update-specialty.dto';
import {
  SpecialtyNotFoundError,
  SpecialtyExistsError,
  InvalidImageUrlError,
} from '../../domain/errors/domain.error';
import { SpecialtyName } from '../../domain/value-objects/specialty-name.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';

export class UpdateSpecialtyUseCase {
  constructor(private specialtyRepository: SpecialtyRepository) {}

  async execute(id: string, dto: UpdateSpecialtyDto): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) throw new SpecialtyNotFoundError(id);

    let updatedName = specialty.name;
    if (dto.name && dto.name !== specialty.name) {
      const existing = await this.specialtyRepository.findByName(dto.name);
      if (existing) throw new SpecialtyExistsError(dto.name);
      updatedName = new SpecialtyName(dto.name).value;
    }

    const updatedDescription =
      dto.description !== undefined ? dto.description : specialty.description;

    let updatedImageUrl = specialty.imageUrl;
    if (dto.imageUrl !== undefined) {
      try {
        updatedImageUrl = dto.imageUrl
          ? new ImageUrl(dto.imageUrl).value
          : null;
      } catch {
        throw new InvalidImageUrlError();
      }
    }

    const updatedSpecialty = new Specialty(
      specialty.id,
      updatedName,
      updatedDescription,
      updatedImageUrl,
      specialty.createdAt,
      new Date(), // Update timestamp
    );

    await this.specialtyRepository.update(updatedSpecialty);
    return updatedSpecialty;
  }
}
