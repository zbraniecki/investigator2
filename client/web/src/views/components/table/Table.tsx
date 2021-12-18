import React from "react";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { Row } from "./Row";
import { HeaderRow } from "./Header";
import {
  TableMeta,
  TableState,
  RowsData,
  SortColumn,
  SortDirection,
  HeadersData,
  HeaderData,
  TableSummaryRow,
} from "./Data";
import { assert } from "../../../utils/helpers";

function sortFunc(sortColumns: SortColumn[], a: any, b: any): number {
  const sortColumn = sortColumns[0];
  assert(sortColumn);

  const bottom =
    sortColumn.direction === SortDirection.Asc ? Infinity : -Infinity;

  let aval = a.cells[sortColumn.column];
  if (aval === undefined || aval === null) {
    aval = bottom;
  }
  let bval = b.cells[sortColumn.column];
  if (bval === undefined || bval === null) {
    bval = bottom;
  }

  const sign = sortColumn.direction === SortDirection.Asc ? 1 : -1;

  if (aval < bval) {
    return -1 * sign;
  }

  if (aval > bval) {
    return 1 * sign;
  }

  if (sortColumns.length > 1) {
    return sortFunc(sortColumns.slice(1), a, b);
  }

  return 0;
}
export interface Props {
  meta: TableMeta;
  state: TableState;
  summary?: TableSummaryRow;
  rows?: RowsData;
  nested: boolean;
}

function findColumn(key: string, headers: HeadersData): HeaderData | undefined {
  for (const header of headers) {
    if (header.key === key) {
      return header;
    }
  }
  return undefined;
}

export function Table({ meta, state, summary, rows, nested }: Props) {
  const [customSortOrder, setCustomSortOrder] = React.useState(
    undefined as undefined | SortColumn
  );

  const sortOrder: SortColumn[] = [];

  for (const column of meta.sortColumns) {
    const header = findColumn(column, meta.headers);
    if (header !== undefined) {
      sortOrder.push({
        column,
        direction: header.sort,
      });
    }
  }

  if (customSortOrder !== undefined) {
    sortOrder.unshift(customSortOrder);
  }

  if (rows) {
    rows.sort(sortFunc.bind(undefined, sortOrder));
  }

  return (
    <MUITable>
      {state.showHeaders && (
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
          }}
        >
          <HeaderRow
            meta={meta}
            summary={summary}
            sortOrder={sortOrder}
            setCustomSortOrder={setCustomSortOrder}
            nested={nested}
          />
        </TableHead>
      )}
      <TableBody>
        {rows?.map((row, idx) => {
          const id = `${meta.name}-row-${idx}`;
          return (
            <Row id={id} key={id} data={row} tableMeta={meta} nested={nested} />
          );
        })}
      </TableBody>
    </MUITable>
  );
}
