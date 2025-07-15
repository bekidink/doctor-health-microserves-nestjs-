export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ServiceNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Service with ID ${id} not found`);
  }
}

export class ServiceExistsError extends DomainError {
  constructor(code: string) {
    super(`Service with code ${code} already exists`);
  }
}

export class InvalidImageUrlError extends DomainError {
  constructor() {
    super('Invalid image URL provided');
  }
}

export class InvalidPriceError extends DomainError {
  constructor() {
    super('Price must be a positive number');
  }
}
