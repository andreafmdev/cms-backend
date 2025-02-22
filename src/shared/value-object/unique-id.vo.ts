export abstract class UniqueId<T> {
  private readonly value: T;

  protected constructor(value: T) {
    this.value = value;
  }

  toString(): string {
    return String(this.value);
  }

  equals(other: UniqueId<T>): boolean {
    return this.value === other.value;
  }

  getValue(): T {
    return this.value;
  }
}
