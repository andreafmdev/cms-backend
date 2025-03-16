const DEFAULT_PAGE = parseInt(process.env.DEFAULT_PAGINATION_PAGE ?? '1');
const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGINATION_LIMIT ?? '10');

export class PaginatedResponseDto<T> implements IPaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
  };
  constructor(
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number,
  ) {
    const currentPageNumber =
      Number(currentPage) && Number(currentPage) > 0
        ? Number(currentPage)
        : DEFAULT_PAGE;
    const itemsPerPageNumber =
      Number(itemsPerPage) && Number(itemsPerPage) > 0
        ? Number(itemsPerPage)
        : DEFAULT_LIMIT;
    const totalPages = Math.ceil(totalItems / itemsPerPageNumber);
    this.data = data;
    this.meta = {
      totalItems,
      currentPage: currentPageNumber,
      itemCount: data.length,
      itemsPerPage: itemsPerPageNumber,
      totalPages: totalPages,
    };
  }
}

interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    //Total number of items in the collection
    totalItems: number;
    //Current page number
    currentPage: number;
    //Number of items in the current page
    itemCount: number;
    //Number of items per page
    itemsPerPage: number;
    //Total number of pages
    totalPages: number;
  };
}
