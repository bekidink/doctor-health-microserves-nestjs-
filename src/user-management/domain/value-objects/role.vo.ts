export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export class Role {
  constructor(public readonly value: UserRole) {
    if (!Object.values(UserRole).includes(value)) {
      throw new Error(`Invalid role: ${value}`);
    }
  }
}
