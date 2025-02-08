// THIS EXCEPTION IS USED TO HANDLE DOMAIN ERRORS AND CAN BE USED IN THE DOMAIN LAYER
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}
