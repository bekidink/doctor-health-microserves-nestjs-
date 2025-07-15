export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User with ID ${id} not found`);
  }
}

export class UserEmailExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class InvalidEmailError extends DomainError {
  constructor() {
    super('Invalid email address');
  }
}

export class InvalidPasswordError extends DomainError {
  constructor() {
    super('Invalid password');
  }
}
