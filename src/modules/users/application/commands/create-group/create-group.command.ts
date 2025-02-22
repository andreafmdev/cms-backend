// application/commands/create-user.command.ts
export class CreateGroupCommand {
  constructor(
    public readonly name: string,
    public readonly permissions: string[],
  ) {}
}
