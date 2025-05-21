import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBrandOptionsQuery } from './get-brand-options.query';
import { BrandRepository } from '@module/productCatalog/infrastructure/repositories/brand-repository';
import { GetBrandOptionsResponseDto } from './get-brand-options.response';
import { plainToInstance } from 'class-transformer';
@QueryHandler(GetBrandOptionsQuery)
export class GetBrandOptionsQueryHandler
  implements IQueryHandler<GetBrandOptionsQuery>
{
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(): Promise<GetBrandOptionsResponseDto[]> {
    const brands = await this.brandRepository.findAllBrands();
    const response = brands.map((brand) => {
      return plainToInstance(GetBrandOptionsResponseDto, {
        id: brand.getId().toString(),
        name: brand.getName(),
      });
    });
    return response;
  }
}
