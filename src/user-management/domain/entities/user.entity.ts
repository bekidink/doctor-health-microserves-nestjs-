import { UserRole } from '../value-objects/role.vo';
import { InputJsonValue } from '@prisma/client/runtime/library';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly profile: InputJsonValue | null | undefined, // Align with Prisma's JSON type
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
