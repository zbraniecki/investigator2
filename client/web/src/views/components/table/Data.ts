import { percent, currency, number } from "../../../utils/formatters";

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
  children?: RowsData;
  type: RowType;
}

export enum CellAlign {
  Left = "left",
  Right = "right",
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

export interface TableMeta {
  name: string;
  sortColumns: string[];
  headers: HeadersData;
  nested: boolean;
}

export interface TableData {
  summary?: TableSummaryRow;
  rows?: RowsData;
}

export type TableSummaryRow = Record<string, CellValue>;
export interface TableState {
  showHeaders: boolean;
  filter?: Record<string, string>;
}

export function formatValue(
  input: CellValue | undefined,
  formatter: Formatter | undefined
): string {
  if (input === undefined) {
    return "";
  }

  let formattedValue: string;
  if (input === undefined || input === null) {
    return "";
  }
  switch (formatter) {
    case Formatter.Currency: {
      formattedValue = currency(input);
      break;
    }
    case Formatter.Percent: {
      formattedValue = percent(input);
      break;
    }
    case Formatter.Number: {
      formattedValue = number(input);
      break;
    }
    default: {
      formattedValue = input.toString();
      break;
    }
  }
  return formattedValue;
}
