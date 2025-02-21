import { ValueTransformer } from 'typeorm';
import { Uuid } from '@shared/value-object/uuid.vo';

export class UuidTransformer implements ValueTransformer {
  to(value: Uuid): string {
    return value ? value.toString() : '';
  }

  from(value: string): Uuid {
    return value ? new Uuid(value) : new Uuid('');
  }
}
