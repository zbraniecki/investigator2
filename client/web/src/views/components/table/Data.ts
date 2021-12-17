export type CellValue = string | number;

export enum RowType {
  Asset,
  Portfolio,
}

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export enum Formatter {
  Percent,
  Currency,
  Symbol,
  Number,
}
export interface RowData {
  cells: Record<string, CellValue>;
  children?: RowData[];
  type: RowType;
}

export enum CellAlign {
  Left,
  Right,
}
export interface HeaderData {
  label: string;
  key: string;
  width: string;
  align: CellAlign;
  sort: SortDirection;
  formatter?: Formatter;
  editable?: boolean;
  visible?: boolean;
}

export type HeadersData = HeaderData[];
export type RowsData = RowData[];

export interface SortColumn {
  column: string;
  direction: SortDirection;
}

export interface TableData {
  name: string;
  sortColumns: string[];
  headers: HeadersData;
  rows?: RowsData;
}
