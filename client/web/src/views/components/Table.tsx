import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
    headers: {
      label: string;
      id: string;
      align: "inherit" | "left" | "right" | "center" | "justify" | undefined;
      width: number | "auto";
      formatter?: "percent" | "currency" | "number" | "symbol";
    }[];
  };
  data: DataRowProps[];
}

export interface RowProps {
  id: string;
  data: DataRowProps;
  headers: Props["meta"]["headers"];
}

export interface TableProps {
  id: string;
  data: DataRowProps[];
  headers: Props["meta"]["headers"];
  displayHeaders: boolean;
}

const tableSettings = {
  columns: {
    collapse: {
      width: 34 + 16 + 16,
    },
  },
};

function TableComponent({
  id,
  data,
  headers,
  displayHeaders,
}: TableProps) {
  return (
    <Table>
      {displayHeaders && (
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: tableSettings.columns.collapse.width }} />
            {headers.map(({ label, align, width }) => (
              <TableCell
                key={`${id}-header-${label}`}
                align={align}
                sx={{ width }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {data.map((row, idx) => {
          const ident: string = `${id}-row${idx}`;
          return <Row key={ident} id={ident} data={row} headers={headers} />;
        })}
      </TableBody>
    </Table>
  );
};

function Row({ id, data, headers }: RowProps) {
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
                id={`${id}-sub`}
                data={data.children}
                headers={headers}
                displayHeaders={false}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export function Component({ meta: { id, headers }, data }: Props) {
  return (
    <TableContainer component={Paper}>
      <TableComponent id={id} data={data} headers={headers} displayHeaders />
    </TableContainer>
  );
};
