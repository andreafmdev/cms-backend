// application/commands/create-user.command.ts
export class CreateCategoryCommand {
  constructor(
    public readonly categoryName: string,
    public readonly categoryDescription: string,
    public readonly languageCode: string,
    public readonly categoryAttributeName: string,
    public readonly categoryAttributeDescription: string,
  ) {}
}
