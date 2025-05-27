import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBrandOptionsQuery } from './get-brand-options.query';
import { BrandRepository } from '@module/productCatalog/infrastructure/repositories/brand-repository';
import { GetBrandOptionsResponseDto } from './get-brand-options.response';
import { plainToInstance } from 'class-transformer';
import { Brand } from '@module/productCatalog/domain/aggregates/brand';
@QueryHandler(GetBrandOptionsQuery)
export class GetBrandOptionsQueryHandler
  implements IQueryHandler<GetBrandOptionsQuery>
{
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(
    query: GetBrandOptionsQuery,
  ): Promise<GetBrandOptionsResponseDto[]> {
    const brandResponse: GetBrandOptionsResponseDto[] = [];
    let brands: Brand[] = [];
    if (query.name) {
      const name: string = query.name.trim();
      brands = await this.brandRepository.findBrandsByName(name);
    } else {
      brands = await this.brandRepository.findAllBrands();
    }
    brands.forEach((brand) => {
      brandResponse.push(
        plainToInstance(GetBrandOptionsResponseDto, {
          id: brand.getId().toString(),
          name: brand.getName(),
        }),
      );
    });

    return brandResponse;
  }
}
