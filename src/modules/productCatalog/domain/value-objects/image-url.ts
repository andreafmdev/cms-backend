import { ValueObject } from '@shared/kernel/ValueObject';
interface ImageUrlProps {
  value: string;
}
export class ImageUrl extends ValueObject<ImageUrlProps> {
  constructor(value: string) {
    super({ value });
  }
  static create(value: string): ImageUrl {
    return new ImageUrl(value);
  }
  static reconstitute(value: string): ImageUrl {
    return new ImageUrl(value);
  }
  getValue(): string {
    return this.props.value;
  }
  equals(other: ImageUrl): boolean {
    return this.props.value === other.props.value;
  }
  toString(): string {
    return this.props.value;
  }
  validate(): void {
    //TODO ADD VALIDATION FOR IMAGE URL
  }
}
