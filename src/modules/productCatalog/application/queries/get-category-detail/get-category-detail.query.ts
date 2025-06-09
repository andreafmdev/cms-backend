export class GetCategoryDetailQuery {
  constructor(
    public readonly id: string,
    public readonly languageCode: string,
    public readonly includeAllTranslations: boolean,
  ) {
    this.id = id;
    this.languageCode = languageCode;
    this.includeAllTranslations = includeAllTranslations;
  }
}
