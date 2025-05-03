import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductImageDto {
  @ApiProperty({
    description: "URL dell'immagine dopo il caricamento",
    example: 'https://storage.example.com/images/product123.jpg',
  })
  @IsString()
  @IsOptional()
  url: string;

  @ApiProperty({
    description: "File dell'immagine in formato base64 o buffer",
    required: false,
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
  })
  @IsOptional()
  @IsString()
  fileContent?: string;

  @ApiProperty({
    description: "Indica se questa è l'immagine principale del prodotto",
    default: false,
  })
  @IsBoolean()
  isMain: boolean = false;
}
