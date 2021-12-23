import {
  BaseColumnMeta,
  ColumnSettings,
  ColumnMeta,
  buildColumnMeta,
} from "./Column";
import { CellValue } from "./Row";

export interface BaseTableMeta {
  name: string;
  columns: Record<string, BaseColumnMeta>;
  nested?: boolean;
  showHeaders?: boolean;
}

export interface TableSettings {
  sortColumns?: string[];
  columns?: ColumnSettings[];
  filter?: Record<string, string>;
  hideSensitive?: boolean;
}

export interface TableMeta {
  name: string;
  sortColumns: string[];
  columns: ColumnMeta[];
  nested: boolean;
  filter: Record<string, string> | null;
  showHeaders: boolean;
  hideSensitive: boolean;
}

export type TableSummaryRow = Record<string, CellValue>;

export function buildTableMeta(
  base: BaseTableMeta,
  settings: TableSettings
): TableMeta {
  return {
    name: base.name,
    sortColumns: settings.sortColumns || [],
    columns: buildColumnsMeta(base.columns, settings.columns),
    nested: base.nested || false,
    filter: settings.filter || null,
    showHeaders: base.showHeaders || false,
    hideSensitive: settings.hideSensitive || false,
  };
}

function buildColumnsMeta(
  base: Record<string, BaseColumnMeta>,
  settings?: ColumnSettings[]
): ColumnMeta[] {
  if (settings === undefined) {
    return [];
  }
  return settings.map((column) => buildColumnMeta(base[column.key], column));
}
