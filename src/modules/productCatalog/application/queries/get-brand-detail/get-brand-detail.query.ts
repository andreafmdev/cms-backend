import { GetBrandDetailRequestDto } from './get-brand-detail.request';

export class GetBrandDetailQuery {
  constructor(public readonly request: GetBrandDetailRequestDto) {
    this.request = request;
  }
}
