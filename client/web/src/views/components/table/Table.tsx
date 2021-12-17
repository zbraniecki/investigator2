import React from "react";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { Row } from "./Row";
import { HeaderRow } from "./Header";
import {
  TableData,
  SortColumn,
  SortDirection,
  HeadersData,
  HeaderData,
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
  data: TableData;
}

function findColumn(key: string, headers: HeadersData): HeaderData | undefined {
  for (const header of headers) {
    if (header.key === key) {
      return header;
    }
  }
  return undefined;
}

export function Table({ data }: Props) {
  const [customSortOrder, setCustomSortOrder] = React.useState(
    undefined as undefined | SortColumn
  );

  const sortOrder: SortColumn[] = [];

  for (const column of data.sortColumns) {
    const header = findColumn(column, data.headers);
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

  if (data.rows) {
    data.rows.sort(sortFunc.bind(undefined, sortOrder));
  }

  return (
    <MUITable>
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
          data={data}
          sortOrder={sortOrder}
          setCustomSortOrder={setCustomSortOrder}
        />
      </TableHead>
      <TableBody>
        {data.rows?.map((row, idx) => {
          const id = `${data.name}-row-${idx}`;
          return <Row id={id} key={id} data={row} headers={data.headers} />;
        })}
      </TableBody>
    </MUITable>
  );
}
