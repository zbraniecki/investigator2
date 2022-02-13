import {
  percent,
  currency,
  number,
  fraction,
} from "../../../../utils/formatters";
import { CellValue } from "./Row";

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export enum Formatter {
  Percent,
  Currency,
  Symbol,
  Number,
  Fraction,
}

export enum CellAlign {
  Left = "left",
  Right = "right",
}

export type ColumnsMeta = ColumnMeta[];

export interface BaseColumnMeta {
  label: string;
  width: string;
  align: CellAlign;
  sortDirection: SortDirection;
  formatter?: Formatter;
  editable?: boolean;
  sensitive?: boolean;
  modal?: (cells: Record<string, any>, updateDialogState: any) => void;
}

export interface ColumnSettings {
  key: string;
  visible?: boolean;
}

export interface ColumnMeta {
  key: string;
  label: string;
  width: string;
  align: CellAlign;
  sortDirection: SortDirection;
  formatter?: Formatter;
  editable: boolean;
  visible: boolean;
  sensitive: boolean;
  modal: ((cells: Record<string, any>, updateDialogState: any) => void) | null;
}

export interface SortColumn {
  column: string;
  direction: SortDirection;
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
    case Formatter.Fraction: {
      formattedValue = fraction(input);
      break;
    }
    default: {
      formattedValue = input.toString();
      break;
    }
  }
  return formattedValue;
}

export function buildColumnMeta(
  base: BaseColumnMeta,
  settings: ColumnSettings
): ColumnMeta {
  return {
    key: settings.key,
    label: base.label,
    width: base.width,
    align: base.align,
    sortDirection: base.sortDirection,
    formatter: base.formatter,
    editable: base.editable !== undefined ? base.editable : false,
    visible: settings?.visible !== undefined ? settings.visible : false,
    sensitive: base.sensitive || false,
    modal: base.modal || null,
  };
}
