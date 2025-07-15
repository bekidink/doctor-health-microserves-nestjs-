import { Specialty } from '../../domain/entities/specialty.entity';
import { SpecialtyRepository } from '../../domain/interfaces/specialty.repository';

export class GetSpecialtiesUseCase {
  constructor(private specialtyRepository: SpecialtyRepository) {}

  async execute(): Promise<Specialty[]> {
    return await this.specialtyRepository.findAll();
  }
}
