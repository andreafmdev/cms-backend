import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { GetLanguagesQuery } from './application/queries/get-languages/get-languages.query';
import { GetLanguagesResponse } from './application/queries/get-languages/get-languages.response';
import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import { GetLanguagesRequest } from './application/queries/get-languages/get-languages.request';

@ApiTags('Languages')
@Controller('languages')
@ApiBearerAuth()
@RequireGroup('ADMIN')
export class LanguageController {
  constructor(private readonly queryBus: QueryBus) {}
  @ApiOperation({ summary: 'Get all active languages' })
  @ApiResponse({
    status: 200,
    description: 'All active languages',
    type: GetLanguagesResponse,
  })
  @Get('/active')
  async findAllActiveLanguages(
    @Query() request: GetLanguagesRequest,
  ): Promise<GetLanguagesResponse[]> {
    return await this.queryBus.execute(new GetLanguagesQuery(request));
  }
}
