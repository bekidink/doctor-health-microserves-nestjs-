import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/interfaces/user.repository';
import { CreateUserDto } from '../dtos/register-user.dto';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Role } from '../../domain/value-objects/role.vo';
import { UserEmailExistsError } from '../../domain/errors/domain.error';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const email = new Email(dto.email);
    const password = new Password(dto.password);
    const role = new Role(dto.role);
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new UserEmailExistsError(dto.email);

    const hashedPassword = await password.hash();
    const user = new User(
      uuidv4(),
      dto.email,
      hashedPassword,
      dto.role,
      dto.profile,
    );
    await this.userRepository.save(user);
    return user;
  }
}
