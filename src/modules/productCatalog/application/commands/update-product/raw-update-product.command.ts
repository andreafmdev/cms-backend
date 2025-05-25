export interface RawUpdateProductRequest {
  price?: string;
  brandId?: string;
  categoryId?: string;
  isAvailable?: string;
  isFeatured?: string; // "true" | "false"
  translations?: string; // JSON string
  attributesValues?: string; // JSON string
  // Le immagini arrivano separatamente via @UploadedFiles()
}
