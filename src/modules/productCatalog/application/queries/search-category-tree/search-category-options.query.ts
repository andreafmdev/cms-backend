export class SearchCategoryOptionsQuery {
  public readonly name?: string;
  public readonly languageCode?: string;
  constructor(name?: string, languageCode?: string) {
    this.name = name;
    this.languageCode = languageCode;
  }
}
