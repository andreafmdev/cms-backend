import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateBrandCommand } from './create-brand.command';
import { CreateBrandResponseDto } from './create-brand.response';
import { BrandService } from '../../services/brand.service';

@CommandHandler(CreateBrandCommand)
export class CreateBrandCommandHandler
  implements ICommandHandler<CreateBrandCommand>
{
  constructor(private readonly brandService: BrandService) {}

  async execute(command: CreateBrandCommand): Promise<CreateBrandResponseDto> {
    const { name } = command;
    const brand = await this.brandService.createBrand(name);
    return { id: brand.getId().toString() };
  }
}
