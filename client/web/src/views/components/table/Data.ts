export type RowData = Record<string, string>;

export interface HeaderData {
  label: string;
  key: string;
  width: string;
  editable?: boolean;
}

export type HeadersData = HeaderData[];
export type RowsData = RowData[];

export interface TableData {
  id: string;
  headers: HeadersData;
  rows: RowsData;
}
