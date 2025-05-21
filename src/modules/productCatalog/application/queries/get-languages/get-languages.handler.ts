import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLanguagesQuery } from './get-languages.query';
import { LanguageService } from '../../services/language.service';
import { GetLanguagesResponse } from './get-languages.response';
import { plainToInstance } from 'class-transformer';
@QueryHandler(GetLanguagesQuery)
export class GetLanguagesHandler implements IQueryHandler<GetLanguagesQuery> {
  constructor(private readonly languageService: LanguageService) {}

  async execute(): Promise<GetLanguagesResponse[]> {
    const languages = await this.languageService.findAllActiveLanguages();
    const languagesResponse: GetLanguagesResponse[] = [];
    languages.forEach((language) => {
      languagesResponse.push(
        plainToInstance(GetLanguagesResponse, {
          languageCode: language.getCode().getValue(),
          languageName: language.getName(),
          isActive: language.getIsActive(),
          isDefault: language.getIsDefault(),
        }),
      );
    });
    return languagesResponse;
  }
}
