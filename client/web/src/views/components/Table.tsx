import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { SortDirection } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from '@mui/material/Box';
import { currency, number, percent, symbol } from "../../utils/formatters";
import { visuallyHidden } from '@mui/utils';

interface DataRowProps {
  cells: {
    [key: string]: string | number | undefined;
  };
  children?: DataRowProps[];
}

export interface Props {
  meta: {
    id: string;
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
  hideSensitive: boolean;
}

export interface TableProps {
  tableId: string;
  data: DataRowProps[];
  headers: Props["meta"]["headers"];
  displayHeaders: boolean;
  sortable: boolean;
  hideSensitive: boolean;
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
  hideSensitive,
}: TableProps) {
  const [orderBy, setOrderBy] = React.useState("market_cap_rank");
  const [sortDirection, setSortDirection] = React.useState("desc");

  data.sort((a, b) => {
    let aval = a.cells[orderBy] || 0;
    let bval = b.cells[orderBy] || 0;
    if (sortDirection === "asc") {
      return bval > aval ? 1 : -1;
    } else {
      return bval > aval ? -1 : 1;
    }
  });

  const createSortHandler = (id: any) => {
    return () => {
      if (orderBy !== id) {
        setOrderBy(id);
        setSortDirection("desc");
      } else {
        setSortDirection(sortDirection === "asc" ? "desc": "asc");
      }
    };
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
                sortDirection={orderBy === id ? sortDirection as SortDirection : false}
                sx={{ width }}
              >
                <TableSortLabel
                  direction={orderBy === id && sortDirection === "asc" ? "asc" : "desc"}
                  active={orderBy === id}
                  onClick={createSortHandler(id)}
                >
                  {label}
                  {orderBy === id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
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
              headers={headers}
              hideSensitive={hideSensitive}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

function Row({ id, data, headers, hideSensitive }: RowProps) {
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
  meta: { id, headers },
  data,
  hideSensitive,
}: Props) {
  return (
    <TableContainer component={Paper}>
      <TableComponent
        tableId={id}
        data={data}
        headers={headers}
        displayHeaders
        sortable
        hideSensitive={hideSensitive}
      />
    </TableContainer>
  );
}
