import { UserRole } from '../../domain/value-objects/role.vo';

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
  profile: Record<string, any>; // e.g., { firstName: string, lastName: string, license?: string, dob?: string }
}