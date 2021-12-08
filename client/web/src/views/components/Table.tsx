import React from "react";
import { useSelector, useDispatch } from "react-redux";
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
import Typography from "@mui/material/Typography";
import { Component as Card } from "../components/Card";
import { visuallyHidden } from "@mui/utils";
import { currency, number, percent, symbol } from "../../utils/formatters";
import { RowsPerPageOption, getRowsPerPageOption, setRowsPerPageOption } from "../../store/ui";

export interface SymbolNameCell extends Record<string, string | undefined> {
  symbol?: string;
  name?: string;
}

export interface DataRowProps {
  cells: {
    [key: string]: string | number | undefined | SymbolNameCell;
  };
  children?: DataRowProps[];
  type: "portfolio" | "asset" | "catch-all";
}

export interface Props {
  meta: {
    id: string;
    sort: {
      column: string;
      direction: "desc" | "asc";
    };
    nested?: boolean;
    headers: {
      label: string;
      id: string;
      align: "inherit" | "left" | "right" | "center" | "justify" | undefined;
      width: number | "auto";
      formatter?: "percent" | "currency" | "number" | "symbol" | "currency-delta";
      colorDiff?: boolean;
      sensitive?: boolean;
    }[];
    pager?: boolean;
    header?: boolean;
    outline?: boolean;
  };
  subHeaderRow?: DataRowProps;
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
  nested?: boolean;
  hideSensitive: boolean;
  setOpenModal: any;
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
  nested?: boolean;
  hideSensitive: boolean;
  subHeaderRow?: DataRowProps;
  slice?: [number, number];
  setOpenModal: any;
}

const tableSettings = {
  columns: {
    collapse: {
      width: 34 + 16 + 16,
    },
  },
};

function sortFunc(orderBy: any, sortDirection: any, a: any, b: any): number {
  let aval = a.cells[orderBy];
  if (aval === undefined || aval === null || a.type === "catch-all") {
    aval = Infinity;
  }
  let bval = b.cells[orderBy];
  if (bval === undefined || bval === null || b.type === "catch-all") {
    bval = Infinity;
  }
  if (aval === bval) {
    return sortFunc("current", "asc", a, b);
  }

  if (sortDirection === "asc") {
    return bval > aval ? 1 : -1;
  }
  return bval > aval ? -1 : 1;
}

function TableComponent({
  tableId,
  data,
  headers,
  displayHeaders,
  sortable,
  defaultSort,
  hideSensitive,
  nested,
  subHeaderRow,
  slice,
  setOpenModal,
}: TableProps) {
  const [orderBy, setOrderBy] = React.useState(defaultSort.column);
  const [sortDirection, setSortDirection] = React.useState(
    defaultSort.direction
  );

  data.sort(sortFunc.bind(undefined, orderBy, sortDirection));

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
            {nested && (
              <TableCell sx={{ borderBottom: 0, width: tableSettings.columns.collapse.width }} />
            )}
            {headers.map(({ id, label, align, width }) => (
              <TableCell
                key={`${tableId}-header-${label}`}
                align={align}
                sortDirection={
                  orderBy === id ? (sortDirection as SortDirection) : false
                }
                sx={{ borderBottom: 0, width, paddingBottom: 0 }}
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
          {subHeaderRow && (
            <Row
              id={`${tableId}-sub-header-row`}
              headers={headers}
              data={subHeaderRow}
              defaultSort={defaultSort}
              nested={nested}
              hideSensitive={hideSensitive}
              setOpenModal={setOpenModal}
            />
          )}
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
              nested={nested}
              hideSensitive={hideSensitive}
              setOpenModal={setOpenModal}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

function Row({
  id,
  data,
  headers,
  defaultSort,
  nested,
  hideSensitive,
  setOpenModal,
}: RowProps) {
  const [open, setOpen] = React.useState(false);

  const subHeaderRow = id.includes("sub-header-row");

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {nested && (
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
        )}
        {headers.map((header) => {
          const rawValue = data.cells[header.id];
          let value;
          let color = "inherit";
          let fontWeight = "regular";
          let fontSize = undefined;

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
              case "currency-delta": {
                if (rawValue > 1000) {
                  fontWeight = "bold";
                  color = "success.main";
                }
                value = currency(rawValue);
                break;
              }
              case "number": {
                value = number(rawValue);
                break;
              }
              case "symbol": {
                // value = symbol(rawValue);
                if (typeof rawValue === "string") {
                  value = rawValue;
                } else {
                  const v = rawValue as Record<string, string>;
                  value = (
                    <>
                      <Typography sx={{ fontSize: "small" }}
                        onClick={() => {setOpenModal(true)}}
                      >
                        {v.symbol.toUpperCase()}
                      </Typography>
                      <Typography
                        onClick={() => {setOpenModal(true)}}
                        sx={{
                          color: "text.disabled",
                          fontWeight: "light",
                          fontSize: "small",
                        }}
                      >
                        {v.name}
                      </Typography>
                    </>
                  );
                }
                break;
              }
              case "percent": {
                value = percent(rawValue);
                if (header.colorDiff) {
                  if (rawValue > 0.01) {
                    color = "success.main";
                  } else if (rawValue < -0.01) {
                    color = "error.main";
                  }
                  if (rawValue > 0.1 || rawValue < -0.1) {
                    fontWeight = "bold";
                  }
                }
                break;
              }
              default: {
                value = rawValue;
                break;
              }
            }
          }

          let paddingTop: number | undefined = 0;
          let paddingBottom: number | undefined = 0;

          if (subHeaderRow) {
            paddingTop = 0;
            paddingBottom = 0;
            fontSize = "small";
            color = "text.disabled";
          }

          if (typeof value === "string") {
            value = <Typography sx={{ color, fontWeight, fontSize }}>{value}</Typography>;
            if (!subHeaderRow) {
              paddingTop = undefined;
              paddingBottom = 1;
            } else {
              paddingBottom = 1;
            }
          }


          return (
            <TableCell
              key={`${id}-${header.label}`}
              align={header.align}
              sx={{ width: header.width, paddingTop, paddingBottom }}
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
                nested={nested}
                hideSensitive={hideSensitive}
                setOpenModal={setOpenModal}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function Component({
  meta: { id, sort, nested, headers, pager, header, outline },
  data,
  subHeaderRow,
  hideSensitive,
}: Props) {
  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch();
  let rpp = useSelector(getRowsPerPageOption);

  let rowsPerPage;
  switch (rpp) {
    case RowsPerPageOption.Count5:
      rowsPerPage = 5;
      break;
    case RowsPerPageOption.Count10:
      rowsPerPage = 10;
      break;
    case RowsPerPageOption.Count30:
      rowsPerPage = 30;
      break;
    case RowsPerPageOption.Count50:
      rowsPerPage = 50;
      break;
    case RowsPerPageOption.All:
    default:
      rowsPerPage = -1;
      break;
  }

  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    let v = parseInt(event.target.value, 10);
    switch (v) {
      case 5:
        dispatch(setRowsPerPageOption(RowsPerPageOption.Count5));
        break;
      case 10:
        dispatch(setRowsPerPageOption(RowsPerPageOption.Count10));
        break;
      case 30:
        dispatch(setRowsPerPageOption(RowsPerPageOption.Count30));
        break;
      case 50:
        dispatch(setRowsPerPageOption(RowsPerPageOption.Count50));
        break;
      case -1:
        dispatch(setRowsPerPageOption(RowsPerPageOption.All));
        break;
    }
    setPage(0);
  };

  let elevation = outline ? 1 : 0; 
  let sx = outline ? {} : {bgcolor: "inherit"};

  return (
    <>
      <TableContainer component={Paper} elevation={elevation} sx={sx} >
        <TableComponent
          tableId={id}
          data={data}
          headers={headers}
          displayHeaders={header || false}
          sortable
          defaultSort={sort}
          hideSensitive={hideSensitive}
          subHeaderRow={subHeaderRow}
          nested={nested}
          slice={[page * rowsPerPage, page * rowsPerPage + rowsPerPage]}
          setOpenModal={setOpenModal}
        />
      </TableContainer>
      { pager &&
      <TablePagination
        rowsPerPageOptions={[5, 10, 30, 50, { label: "All", value: -1 }]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      }
      <Card meta={{id: "foo", openModal, setOpenModal}} data={{name: {name: "Foo"}}} />
    </>
  );
}
