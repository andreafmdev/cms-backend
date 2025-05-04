export class GetCategoryDetailQuery {
  constructor(
    public readonly id: string,
    public readonly languageCode: string,
  ) {
    this.id = id;
    this.languageCode = languageCode;
  }
}
