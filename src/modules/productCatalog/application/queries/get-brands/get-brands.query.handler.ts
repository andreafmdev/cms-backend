import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBrandsQuery } from './get-brands.query';
import { BrandRepository } from '@module/productCatalog/infrastructure/repositories/brand-repository';
import { GetBrandsResponseDto } from './get-brands.response';
import { plainToInstance } from 'class-transformer';
@QueryHandler(GetBrandsQuery)
export class GetBrandsQueryHandler implements IQueryHandler<GetBrandsQuery> {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(): Promise<GetBrandsResponseDto[]> {
    const brands = await this.brandRepository.findAllBrands();
    const response = brands.map((brand) => {
      return plainToInstance(GetBrandsResponseDto, {
        id: brand.getId().toString(),
        name: brand.getName(),
      });
    });
    return response;
  }
}
