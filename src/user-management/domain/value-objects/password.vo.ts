import * as bcrypt from 'bcrypt';

export class Password {
  constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  private isValid(password: string): boolean {
    return password.length >= 8;
  }

  async hash(): Promise<string> {
    return await bcrypt.hash(this.value, 10);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.value);
  }
}
