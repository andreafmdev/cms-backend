import { BadRequestException } from '@nestjs/common';
import { ValueObject } from '@shared/kernel/value-object.abstract';

interface EmailProps {
  value: string;
}

// modules/users/domain/model/Email.vo.ts
export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new BadRequestException('Invalid email format');
    }
    return new Email({ value: email });
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public getValue(): string {
    return this.props.value;
  }

  public toString(): string {
    return this.props.value;
  }

  public equals(other: Email): boolean {
    return this.props.value === other.props.value;
  }
}
