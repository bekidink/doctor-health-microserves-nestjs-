export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class AppointmentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Appointment with ID ${id} not found`);
  }
}

export class AppointmentConflictError extends DomainError {
  constructor(doctorId: string, startTime: Date) {
    super(`Doctor ${doctorId} is already booked at ${startTime.toISOString()}`);
  }
}

export class InvalidUserRoleError extends DomainError {
  constructor(userId: string, role: string) {
    super(`User ${userId} must be a ${role}`);
  }
}

export class InvalidTimeError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
