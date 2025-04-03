export class IntId {
  private constructor(private readonly value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('ID must be a positive integer');
    }
  }
  static create(value: number): IntId {
    return new IntId(value);
  }
  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return this.value.toString();
  }

  public equals(other: IntId): boolean {
    return other instanceof IntId && this.value === other.value;
  }
}
