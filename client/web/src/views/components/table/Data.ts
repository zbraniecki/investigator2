export type CellValue = string | number;
export type RowData = Record<string, CellValue>;

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
