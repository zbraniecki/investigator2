export type CellValue = string | number;

export enum RowType {
  Asset,
  Portfolio,
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
  editable?: boolean;
}

export type HeadersData = HeaderData[];
export type RowsData = RowData[];

export interface TableData {
  id: string;
  headers: HeadersData;
  rows: RowsData;
}
