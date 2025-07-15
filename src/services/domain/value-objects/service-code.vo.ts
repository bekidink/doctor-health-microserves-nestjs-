export class ServiceCode {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(
        'Service code must be at least 3 characters long and alphanumeric',
      );
    }
  }

  private isValid(code: string): boolean {
    if (!code || code.length < 3) return false;
    const codeRegex = /^[a-zA-Z0-9]+$/;
    return codeRegex.test(code);
  }
}
