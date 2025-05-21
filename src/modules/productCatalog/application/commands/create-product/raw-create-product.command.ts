export interface RawCreateProductRequest {
  price: string;
  brandId: string;
  categoryId: string;
  isAvailable: string;
  isFeatured: string;
  translations: string; // JSON string
}
