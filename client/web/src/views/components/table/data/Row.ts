export type CellValue = string | number;

export interface CellData<T> {
  value: T;
  color?: string;
}

export enum RowType {
  Asset,
  Portfolio,
}

export interface RowData {
  cells: Record<string, CellValue>;
  children?: RowsData;
  type: RowType;
}

export interface StyledRowData {
  cells: Record<string, CellData<CellValue>>;
  children?: StyledRowsData;
  type: RowType;
}

export type RowsData = RowData[];
export type StyledRowsData = StyledRowData[];

export function newCellData<T>(value: T | undefined): CellData<T> | undefined {
  if (value === undefined) {
    return undefined;
  }
  return {
    value,
  };
}
