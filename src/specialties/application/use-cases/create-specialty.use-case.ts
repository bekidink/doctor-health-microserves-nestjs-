import { Specialty } from '../../domain/entities/specialty.entity';
import { SpecialtyRepository } from '../../domain/interfaces/specialty.repository';
import { CreateSpecialtyDto } from '../dtos/create-specialty.dto';
import { SpecialtyName } from '../../domain/value-objects/specialty-name.vo';
import { ImageUrl } from '../../domain/value-objects/image-url.vo';
import {
  SpecialtyExistsError,
  InvalidImageUrlError,
} from '../../domain/errors/domain.error';
import { v4 as uuidv4 } from 'uuid';

export class CreateSpecialtyUseCase {
  constructor(private specialtyRepository: SpecialtyRepository) {}

  async execute(dto: CreateSpecialtyDto): Promise<Specialty> {
    const name = new SpecialtyName(dto.name);
    const existing = await this.specialtyRepository.findByName(dto.name);
    if (existing) throw new SpecialtyExistsError(dto.name);

    let imageUrl: string | null = null;
    if (dto.imageUrl) {
      try {
        imageUrl = new ImageUrl(dto.imageUrl).value;
      } catch {
        throw new InvalidImageUrlError();
      }
    }

    const specialty = new Specialty(
      uuidv4(),
      dto.name,
      dto.description!,
      imageUrl,
    );
    await this.specialtyRepository.save(specialty);
    return specialty;
  }
}
