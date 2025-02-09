//import { v4 as uuidv4 } from 'uuid';
import { UniqueId } from './unique-id.vo';

export class Uuid extends UniqueId<string> {
  constructor(value: string) {
    super(value); //TODO Genera un UUID se non fornito
  }
}
