export class UpdateBrandCommand {
  constructor(
    public readonly name: string,
    public readonly id: string,
  ) {}
}
