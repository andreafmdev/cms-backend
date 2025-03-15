//!TOCOMPLETE

export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  IN = 'in',
  LIKE = 'like',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  AND = 'and',
  OR = 'or',
}

export interface IFilter {
  field: string;
  operator: FilterOperator;
  value: any;
}

export class Filter implements IFilter {
  constructor(
    public field: string,
    public operator: FilterOperator,
    public value: any,
  ) {}

  static equals(field: string, value: any): Filter {
    return new Filter(field, FilterOperator.EQUALS, value);
  }

  static like(field: string, value: string): Filter {
    return new Filter(field, FilterOperator.LIKE, value);
  }
}

/**
 * Un filtro composito permette di combinare più filtri elementari
 * usando gli operatori logici AND/OR.
 */
export class FilterComposite {
  constructor(
    public operator: FilterOperator.AND | FilterOperator.OR,
    public filters: (Filter | FilterComposite)[],
  ) {}

  static and(filters: (Filter | FilterComposite)[]): FilterComposite {
    return new FilterComposite(FilterOperator.AND, filters);
  }

  static or(filters: (Filter | FilterComposite)[]): FilterComposite {
    return new FilterComposite(FilterOperator.OR, filters);
  }
}
