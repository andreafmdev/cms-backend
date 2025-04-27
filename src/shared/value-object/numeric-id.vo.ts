export class IntId {
  private constructor(private readonly value: number) {
    this.validate(value);
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
  public getNumberValue(): number {
    if (!this.hasValue()) {
      throw new Error('ID value is not set');
    }
    return this.value;
  }
  public hasValue(): boolean {
    return this.value !== null && this.value !== undefined;
  }
  public equals(other: IntId): boolean {
    return other instanceof IntId && this.value === other.value;
  }

  private validate(value: number): void {
    if (value <= 0) {
      throw new Error('ID must be a positive number');
    }
  }
}
