import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBrandCommand } from './delete-brand.command';
import { DeleteBrandResponse } from './delete-brand.response';
import { BrandService } from '../../services/brand.service';

@CommandHandler(DeleteBrandCommand)
export class DeleteBrandHandler implements ICommandHandler<DeleteBrandCommand> {
  constructor(private readonly brandService: BrandService) {}

  async execute(command: DeleteBrandCommand): Promise<DeleteBrandResponse> {
    const deleted = await this.brandService.deleteBrand(command.id);
    const response = new DeleteBrandResponse();
    response.success = deleted;
    response.message = deleted
      ? 'Brand deleted successfully'
      : 'Brand not found';
    return response;
  }
}
