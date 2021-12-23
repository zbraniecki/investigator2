export type CellValue = string | number;

export enum RowType {
  Asset,
  Portfolio,
}

export interface RowData {
  cells: Record<string, CellValue>;
  children?: RowsData;
  type: RowType;
}

export type RowsData = RowData[];
