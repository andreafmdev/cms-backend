import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { BrandService } from '../../services/brand.service';
import { GetBrandDetailResponseDto } from './get-brand-detail.response';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { GetBrandDetailQuery } from './get-brand-detail.query';

@QueryHandler(GetBrandDetailQuery)
export class GetBrandDetailHandler
  implements IQueryHandler<GetBrandDetailQuery>
{
  constructor(private readonly brandService: BrandService) {}

  async execute(
    query: GetBrandDetailQuery,
  ): Promise<GetBrandDetailResponseDto> {
    const brandId = BrandId.create(query.request.id);
    const brand = await this.brandService.findBrandById(brandId);

    return plainToInstance(GetBrandDetailResponseDto, {
      id: brand?.getId().toString(),
      name: brand?.getName(),
    });
  }
}
