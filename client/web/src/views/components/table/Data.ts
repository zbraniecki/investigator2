export type CellValue = string | number;

export enum RowType {
  Asset,
  Portfolio,
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
  formatter?: Formatter;
  editable?: boolean;
}

export type HeadersData = HeaderData[];
export type RowsData = RowData[];

export interface TableData {
  name: string;
  headers: HeadersData;
  rows?: RowsData;
}
