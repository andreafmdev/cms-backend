import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemoryStorageFile } from '@x6tech/nest-file-fastify';

export class ProductImageDto {
  @IsString()
  idImage: string;

  @ApiProperty({
    description: "File dell'immagine in formato base64 o buffer",
    required: false,
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
  })
  @IsOptional()
  fileContent?: MemoryStorageFile;

  @ApiProperty({
    description: "Indica se questa è l'immagine principale del prodotto",
    default: false,
  })
  @IsBoolean()
  isMain: boolean = false;
}
