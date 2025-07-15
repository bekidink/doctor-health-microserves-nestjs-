import { SpecialtyRepository } from '../../domain/interfaces/specialty.repository';
import { AssignSpecialtyDto } from '../dtos/assign-specialty.dto';
import { SpecialtyNotFoundError } from '../../domain/errors/domain.error';
import { UserNotFoundError } from '../../../user-management/domain/errors/domain.error';

export class AssignSpecialtyUseCase {
  constructor(
    private specialtyRepository: SpecialtyRepository,
    private userRepository: any, // Simplified; actual implementation requires UserRepository
  ) {}

  async execute(dto: AssignSpecialtyDto): Promise<void> {
    const specialty = await this.specialtyRepository.findById(dto.specialtyId);
    if (!specialty) throw new SpecialtyNotFoundError(dto.specialtyId);

    const user = await this.userRepository.findById(dto.doctorId);
    if (!user || user.role !== 'DOCTOR')
      throw new UserNotFoundError(dto.doctorId);

    await this.specialtyRepository.assignToDoctor(
      dto.specialtyId,
      dto.doctorId,
    );
  }
}
