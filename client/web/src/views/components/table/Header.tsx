import TableRow from "@mui/material/TableRow";
import TableCell, {
  SortDirection as MUISortDirection,
} from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  CellAlign,
  SortColumn,
  SortDirection,
  ColumnMeta,
} from "./data/Column";
import { TableMeta, TableSummaryRow } from "./data/Table";
import { CellValue } from "./data/Row";
import { SubHeaderRow } from "./SubHeader";

interface CellProps {
  id: string;
  columnName: string;
  value?: CellValue;
  align: CellAlign;
  defaultSortDirection: SortDirection;
  sort?: SortDirection;
  setCustomSortOrder: any;
  sx?: any;
}

Cell.defaultProps = {
  value: undefined,
  sort: undefined,
  sx: undefined,
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
  value,
  align,
  defaultSortDirection,
  sort,
  setCustomSortOrder,
  sx,
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
      sx={{ ...sx }}
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

export interface Props {
  tableMeta: TableMeta;
  summary?: TableSummaryRow;
  sortOrder: SortColumn[];
  setCustomSortOrder: any;
  minWidths: Record<string, number>;
}

export function HeaderRow({
  tableMeta,
  summary,
  sortOrder,
  setCustomSortOrder,
  minWidths,
}: Props) {
  const sort = sortOrder.length > 0 ? sortOrder[0] : undefined;

  const subHeader = summary !== undefined;

  const cellSx = subHeader
    ? {
        paddingBottom: 0,
      }
    : {};

  return (
    <>
      <TableRow>
        {tableMeta.nested && (
          <TableCell
            sx={{
              borderBottom: 0,
              width: "66px",
              ...cellSx,
            }}
          />
        )}
        {tableMeta.columns
          .filter((column: ColumnMeta) => column.visible)
          .map((column: ColumnMeta) => {
            const id = `${tableMeta.name}-header-${column.key}`;
            const sx: {
              [key: string]: any;
            } = {
              minWidth: column.minWidth,
              width: column.width,
            };
            if (minWidths[column.key]) {
              sx.display = "none";
              sx[`@media (min-width: ${minWidths[column.key]}px)`] = {
                display: "table-cell",
              };
            }
            return (
              <Cell
                key={id}
                id={id}
                columnName={column.key}
                value={column.label}
                align={column.align}
                defaultSortDirection={column.sortDirection}
                sort={sort?.column === column.key ? sort?.direction : undefined}
                setCustomSortOrder={setCustomSortOrder}
                sx={sx}
              />
            );
          })}
      </TableRow>
      {subHeader && (
        <SubHeaderRow
          summary={summary}
          tableMeta={tableMeta}
          minWidths={minWidths}
        />
      )}
    </>
  );
}
