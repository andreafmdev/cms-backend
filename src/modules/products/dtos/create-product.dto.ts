// src/features/products/dtos/create-product.dto.ts
export class CreateProductDto {
  name: string;

  description?: string;

  price: number;

  imageUrl?: string;
}
