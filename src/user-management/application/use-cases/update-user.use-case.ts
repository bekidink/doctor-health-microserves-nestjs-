import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/interfaces/user.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';
import {
  UserNotFoundError,
  UserEmailExistsError,
} from '../../domain/errors/domain.error';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Role } from '../../domain/value-objects/role.vo';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    let updatedEmail = user.email;
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) throw new UserEmailExistsError(dto.email);
      updatedEmail = new Email(dto.email).value;
    }

    let updatedPassword = user.password;
    if (dto.password) {
      const password = new Password(dto.password);
      updatedPassword = await password.hash();
    }

    const updatedRole = dto.role ? new Role(dto.role).value : user.role;
    const updatedProfile =
      dto.profile !== undefined ? dto.profile : user.profile;

    const updatedUser = new User(
      user.id,
      updatedEmail,
      updatedPassword,
      updatedRole,
      updatedProfile,
      user.createdAt,
      new Date(), // Update timestamp
    );

    await this.userRepository.update(updatedUser);
    return updatedUser;
  }
}
