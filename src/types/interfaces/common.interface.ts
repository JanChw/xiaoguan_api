export interface Pagination {
  page?: string | number;

  size?: string | number;
}

export interface PaginationAndOrderBy {
  page?: string | number;

  size?: string | number;

  orderby?: string
}

export interface ResultWithCount {
  entities?: any[],
  count?: number
}
