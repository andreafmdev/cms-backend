import {
  IsNotEmpty,
  IsJSON,
  IsNumberString,
  IsUUID,
  IsBooleanString,
} from 'class-validator';

export class CreateProductFormRequest {
  @IsNotEmpty({ message: 'The price is mandatory' })
  @IsNumberString({}, { message: 'The price must be a valid number' })
  price: string;

  @IsNotEmpty({ message: 'The brand is mandatory' })
  @IsUUID(4, { message: 'BrandId must be a valid UUID' })
  brandId: string;

  @IsNotEmpty({ message: 'The category is mandatory' })
  @IsUUID(4, { message: 'CategoryId must be a valid UUID' })
  categoryId: string;

  @IsNotEmpty({ message: 'IsAvailable is mandatory' })
  @IsBooleanString({ message: 'IsAvailable must be true or false' })
  isAvailable: string;

  @IsNotEmpty({ message: 'IsFeatured is mandatory' })
  @IsBooleanString({ message: 'IsFeatured must be true or false' })
  isFeatured: string;

  @IsNotEmpty({ message: 'Translations are mandatory' })
  @IsJSON({ message: 'Translations must be a valid JSON' })
  translations: string;

  @IsNotEmpty({ message: 'Attributes are mandatory' })
  @IsJSON({ message: 'Attributes must be a valid JSON' })
  attributes: string;
}
