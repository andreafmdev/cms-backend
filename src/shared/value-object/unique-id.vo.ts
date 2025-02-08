export class UniqueId {
  private readonly value: string;

  constructor(id?: string | number) {
    this.value = id ? String(id) : crypto.randomUUID(); // Genera UUID solo se non fornito
  }

  toString(): string {
    return this.value;
  }

  toNumber(): number | null {
    return isNaN(parseInt(this.value, 10)) ? null : parseInt(this.value, 10);
  }

  equals(other: UniqueId): boolean {
    return this.value === other.toString();
  }
}
