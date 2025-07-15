export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class SpecialtyNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Specialty with ID ${id} not found`);
  }
}

export class SpecialtyExistsError extends DomainError {
  constructor(name: string) {
    super(`Specialty with name ${name} already exists`);
  }
}

export class InvalidImageUrlError extends DomainError {
  constructor() {
    super('Invalid image URL provided');
  }
}
