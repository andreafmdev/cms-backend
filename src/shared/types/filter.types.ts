export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_EQUALS = 'lte',
  CONTAINS = 'contains',
  IN = 'in',
  BETWEEN = 'between',
  IS_NULL = 'isNull',
  IS_NOT_NULL = 'isNotNull',
}

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterOptions {
  fieldMappings?: Record<string, string>;
  excludeFields?: string[];
}
