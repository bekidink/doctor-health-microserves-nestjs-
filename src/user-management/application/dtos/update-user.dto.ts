import { UserRole } from '../../domain/value-objects/role.vo';

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: UserRole;
  profile?: Record<string, any>;
}
