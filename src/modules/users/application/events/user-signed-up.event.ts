export class UserSignedUpEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}
