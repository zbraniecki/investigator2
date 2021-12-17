import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell, {
  SortDirection as MUISortDirection,
} from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  TableData,
  CellAlign,
  CellValue,
  SortColumn,
  SortDirection,
  Formatter,
  formatValue,
} from "./Data";

interface CellProps {
  id: string;
  columnName: string;
  width: string;
  value?: CellValue;
  align: CellAlign;
  defaultSortDirection: SortDirection;
  sort?: SortDirection;
  setCustomSortOrder: any;
}

Cell.defaultProps = {
  value: undefined,
  sort: undefined,
};

function getSortDirection(
  customDirection: SortDirection | undefined,
  defaultDirection: SortDirection
): SortDirection {
  if (customDirection === undefined) {
    return defaultDirection;
  }
  return customDirection;
}

function Cell({
  id,
  columnName,
  width,
  value,
  align,
  defaultSortDirection,
  sort,
  setCustomSortOrder,
}: CellProps) {
  let sortDirection: MUISortDirection | false = false;
  let active = false;

  switch (sort) {
    case SortDirection.Asc: {
      sortDirection = "asc";
      active = true;
      break;
    }
    case SortDirection.Desc: {
      sortDirection = "desc";
      active = true;
      break;
    }
    default:
      break;
  }

  const createSortHandler = (column: string) => () => {
    if (sort === undefined) {
      setCustomSortOrder({
        column,
        direction: defaultSortDirection,
      });
    } else {
      setCustomSortOrder({
        column,
        direction:
          sort === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc,
      });
    }
  };

  return (
    <TableCell
      key={id}
      align={align}
      sortDirection={sortDirection}
      sx={{ width }}
    >
      <TableSortLabel
        direction={getSortDirection(sort, defaultSortDirection)}
        active={active}
        onClick={createSortHandler(columnName)}
      >
        {value}
      </TableSortLabel>
    </TableCell>
  );
}

interface SubHeaderCellProps {
  id: string;
  width: string;
  value?: CellValue;
  align: CellAlign;
  formatter?: Formatter;
}

SubHeaderCell.defaultProps = {
  value: undefined,
  formatter: undefined,
};

function SubHeaderCell({
  id,
  width,
  value,
  align,
  formatter,
}: SubHeaderCellProps) {
  return (
    <TableCell
      key={id}
      align={align}
      sx={{ width, color: "text.disabled", fontSize: "small" }}
    >
      {formatValue(value, formatter)}
    </TableCell>
  );
}

export interface Props {
  data: TableData;
  sortOrder: SortColumn[];
  setCustomSortOrder: any;
  nested: boolean;
}

export function HeaderRow({
  data,
  sortOrder,
  setCustomSortOrder,
  nested,
}: Props) {
  const sort = sortOrder.length > 0 ? sortOrder[0] : undefined;

  return (
    <>
      <TableRow>
        {nested && (
          <TableCell
            sx={{
              borderBottom: 0,
              width: "66px",
            }}
          />
        )}
        {data.headers
          .filter((header) => header.visible)
          .map((header: any) => {
            const id = `${data.name}-header-${header.key}`;
            return (
              <Cell
                key={id}
                id={id}
                columnName={header.key}
                width={header.width}
                value={header.label}
                align={header.align}
                defaultSortDirection={header.sort}
                sort={sort?.column === header.key ? sort?.direction : undefined}
                setCustomSortOrder={setCustomSortOrder}
              />
            );
          })}
      </TableRow>

      <TableRow>
        {nested && (
          <TableCell
            sx={{
              borderBottom: 0,
              width: "66px",
            }}
          />
        )}
        {data.headers
          .filter((header) => header.visible)
          .map((header: any) => {
            const id = `${data.name}-header-${header.key}`;
            const value = data?.summary ? data?.summary[header.key] : undefined;
            return (
              <SubHeaderCell
                key={id}
                id={id}
                width={header.width}
                value={value}
                formatter={header.formatter}
                align={header.align}
              />
            );
          })}
      </TableRow>
    </>
  );
}
