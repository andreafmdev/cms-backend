import { v4 as uuidv4 } from 'uuid';
import { UniqueId } from './unique-id.vo';

export class Uuid extends UniqueId<string> {
  constructor(value: string) {
    super(value); // Genera un UUID se non fornito
  }
  static fromString(uuidString: string): Uuid {
    return new Uuid(uuidString);
  }
}

export class UuidGenerator {
  static generate(): Uuid {
    const uuid: string = uuidv4(); // TypeScript dovrebbe ora riconoscere il tipo come `string`
    return new Uuid(uuid);
  }
}
