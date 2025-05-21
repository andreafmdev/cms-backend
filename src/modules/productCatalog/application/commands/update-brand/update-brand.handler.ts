import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateBrandCommand } from './update-brand.command';
import { UpdateBrandResponseDto } from './update-brand.response';
import { BrandService } from '../../services/brand.service';

@CommandHandler(UpdateBrandCommand)
export class UpdateBrandCommandHandler
  implements ICommandHandler<UpdateBrandCommand>
{
  constructor(private readonly brandService: BrandService) {}

  async execute(command: UpdateBrandCommand): Promise<UpdateBrandResponseDto> {
    const { name, id } = command;
    const brand = await this.brandService.updateBrand(name, id);
    return { id: brand.getId().toString() };
  }
}
