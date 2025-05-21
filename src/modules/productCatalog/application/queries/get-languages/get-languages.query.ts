import { GetLanguagesRequest } from './get-languages.request';

export class GetLanguagesQuery {
  constructor(public readonly filters?: GetLanguagesRequest) {
    console.log('GetLanguagesHandler: costruttore chiamato');

    this.filters = filters;
  }
}
