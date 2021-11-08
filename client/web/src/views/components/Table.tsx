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

interface DataRowProps {
  cells: {
    [key: string]: string | number;
  };
  subData?: DataRowProps[];
}

export interface Props {
  meta: {
    id: string;
    headers: {
      label: string;
      id: string;
      align: "inherit" | "left" | "right" | "center" | "justify" | undefined;
      width: number;
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
      width: 50,
    },
  },
};

function TableComponent({ id, data, headers, displayHeaders }: TableProps) {
  return (
    <Table>
      {displayHeaders && (
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ minWidth: tableSettings.columns.collapse.width }}
            />
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
}

function Row({ id, data, headers }: RowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ minWidth: tableSettings.columns.collapse.width }}>
          {data.subData && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        {headers.map((header) => (
          <TableCell
            key={`${id}-${header.label}`}
            align={header.align}
            sx={{ width: header.width }}
          >
            {data.cells[header.id]}
          </TableCell>
        ))}
      </TableRow>
      {data.subData && (
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <TableComponent
                id={`${id}-sub`}
                data={data.subData}
                headers={headers}
                displayHeaders={false}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function Component({ meta: { id, headers }, data }: Props) {
  return (
    <TableContainer component={Paper}>
      <TableComponent id={id} data={data} headers={headers} displayHeaders />
    </TableContainer>
  );
}
