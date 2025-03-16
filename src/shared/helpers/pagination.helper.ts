// pagination.helper.ts (esempio rapido)
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
export function paginate<T>(
  items: T[],
  totalItems: number,
  page: number,
  limit: number,
) {
  return new PaginatedResponseDto(items, totalItems, page, limit);
}
