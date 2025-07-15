export class SpecialtyName {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(
        'Specialty name must be at least 3 characters long and contain only letters, numbers, spaces, or hyphens',
      );
    }
  }

  private isValid(name: string): boolean {
    if (!name || name.length < 3) {
      return false;
    }
    // Allow letters, numbers, spaces, and hyphens
    const nameRegex = /^[a-zA-Z0-9\s-]+$/;
    return nameRegex.test(name);
  }
}
