import { v4 as uuidv4 } from 'uuid';
import { UniqueId } from './unique-id.vo';

export class Uuid extends UniqueId<string> {
  constructor(value: string) {
    if (!value) {
      value = Uuid.generate().toString();
    }
    super(value); // Genera un UUID se non fornito
  }
  static fromString(uuidString: string): Uuid {
    return new Uuid(uuidString);
  }
  static generate(): Uuid {
    const uuid: string = uuidv4();
    return new Uuid(uuid);
  }
}

export class UuidGenerator {
  static generate(): Uuid {
    const uuid: string = uuidv4(); // TypeScript dovrebbe ora riconoscere il tipo come `string`
    return new Uuid(uuid);
  }
}
