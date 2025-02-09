import { UniqueId } from './unique-id.vo';

export class IntId extends UniqueId<number> {
  constructor(value: number) {
    super(value);
  }
}
