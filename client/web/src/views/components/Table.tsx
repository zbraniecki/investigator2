import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { SortDirection } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import { currency, number, percent, symbol } from "../../utils/formatters";

interface DataRowProps {
  cells: {
    [key: string]: string | number | undefined;
  };
  children?: DataRowProps[];
}

export interface Props {
  meta: {
    id: string;
    sort: {
      column: string;
      direction: "desc" | "asc";
    };
    headers: {
      label: string;
      id: string;
      align: "inherit" | "left" | "right" | "center" | "justify" | undefined;
      width: number | "auto";
      formatter?: "percent" | "currency" | "number" | "symbol";
      sensitive?: boolean;
    }[];
  };
  data: DataRowProps[];
  hideSensitive: boolean;
}

export interface RowProps {
  id: string;
  data: DataRowProps;
  headers: Props["meta"]["headers"];
  defaultSort: {
    column: string;
    direction: "asc" | "desc";
  };
  hideSensitive: boolean;
}

export interface TableProps {
  tableId: string;
  data: DataRowProps[];
  headers: Props["meta"]["headers"];
  displayHeaders: boolean;
  sortable: boolean;
  defaultSort: {
    column: string;
    direction: "asc" | "desc";
  };
  hideSensitive: boolean;
  slice?: [number, number];
}

const tableSettings = {
  columns: {
    collapse: {
      width: 34 + 16 + 16,
    },
  },
};

function TableComponent({
  tableId,
  data,
  headers,
  displayHeaders,
  sortable,
  defaultSort,
  hideSensitive,
  slice,
}: TableProps) {
  const [orderBy, setOrderBy] = React.useState(defaultSort.column);
  const [sortDirection, setSortDirection] = React.useState(
    defaultSort.direction
  );

  data.sort((a, b) => {
    let aval = a.cells[orderBy];
    if (aval === undefined || aval === null) {
      aval = Infinity;
    }
    let bval = b.cells[orderBy];
    if (bval === undefined || bval === null) {
      bval = Infinity;
    }
    if (sortDirection === "asc") {
      return bval > aval ? 1 : -1;
    }
    return bval > aval ? -1 : 1;
  });
  if (slice && slice[1] !== -1) {
    data = data.slice(slice[0], slice[1]);
  }

  const createSortHandler = (id: any) => () => {
    if (orderBy !== id) {
      setOrderBy(id);
      setSortDirection("desc");
    } else {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
  };

  return (
    <Table>
      {displayHeaders && (
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: tableSettings.columns.collapse.width }} />
            {headers.map(({ id, label, align, width }) => (
              <TableCell
                key={`${tableId}-header-${label}`}
                align={align}
                sortDirection={
                  orderBy === id ? (sortDirection as SortDirection) : false
                }
                sx={{ width }}
              >
                <TableSortLabel
                  direction={
                    orderBy === id && sortDirection === "asc" ? "asc" : "desc"
                  }
                  active={orderBy === id}
                  onClick={createSortHandler(id)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {data.map((row, idx) => {
          const ident: string = `${tableId}-row${idx}`;
          return (
            <Row
              key={ident}
              id={ident}
              data={row}
              defaultSort={defaultSort}
              headers={headers}
              hideSensitive={hideSensitive}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

function Row({ id, data, headers, defaultSort, hideSensitive }: RowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: tableSettings.columns.collapse.width }}>
          {data.children && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        {headers.map((header) => {
          const rawValue = data.cells[header.id];
          let value;

          if (rawValue === undefined) {
            value = "";
          } else if (header.sensitive && hideSensitive) {
            value = "*";
          } else {
            switch (header.formatter) {
              case "currency": {
                value = currency(rawValue);
                break;
              }
              case "number": {
                value = number(rawValue);
                break;
              }
              case "symbol": {
                value = symbol(rawValue);
                break;
              }
              case "percent": {
                value = percent(rawValue);
                break;
              }
              default: {
                value = rawValue;
                break;
              }
            }
          }

          return (
            <TableCell
              key={`${id}-${header.label}`}
              align={header.align}
              sx={{ width: header.width }}
            >
              {value}
            </TableCell>
          );
        })}
      </TableRow>
      {data.children && (
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={headers.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <TableComponent
                tableId={`${id}-sub`}
                data={data.children}
                headers={headers}
                displayHeaders={false}
                sortable={false}
                defaultSort={defaultSort}
                hideSensitive={hideSensitive}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function Component({
  meta: { id, sort, headers },
  data,
  hideSensitive,
}: Props) {
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <TableComponent
          tableId={id}
          data={data}
          headers={headers}
          displayHeaders
          sortable
          defaultSort={sort}
          hideSensitive={hideSensitive}
          slice={[page * rowsPerPage, page * rowsPerPage + rowsPerPage]}
        />
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 30, 50, { label: "All", value: -1 }]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
