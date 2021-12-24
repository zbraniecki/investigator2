import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import { useSelector, useDispatch } from "react-redux";
import { TableMeta } from "./data/Table";
import { StyledRowData } from "./data/Row";
import { getSession, updateCellThunk } from "../../../store/account";
import { Table } from "./Table";
import { Cell, EditableCell } from "./Cell";

export interface Props {
  id: string;
  data: StyledRowData;
  tableMeta: TableMeta;
}
export function Row({ id, data, tableMeta }: Props) {
  const [open, setOpen] = React.useState(false);
  const session = useSelector(getSession);

  const dispatch = useDispatch();

  const handleCellUpdate = async (cid: string, quantity: number) => {
    console.log("handling cell update");
    const { value } = data.cells.id;
    return dispatch(
      updateCellThunk({ token: session.token, id: value as string, quantity })
    );
  };

  return (
    <>
      <TableRow key={id}>
        {tableMeta.nested && (
          <TableCell sx={{ width: "66px" }}>
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
        {tableMeta.columns
          .filter((columns) => columns.visible)
          .map((column) => {
            const key = `${id}-${column.key}`;
            const cell = data.cells[column.key];
            const hideValue = column.sensitive && tableMeta.hideSensitive;
            if (column.editable && !hideValue && cell && data.cells.id) {
              return (
                <EditableCell
                  key={key}
                  column={column.key}
                  id={key}
                  data={cell}
                  align={column.align}
                  width={column.width}
                  formatter={column.formatter}
                  onCellUpdate={handleCellUpdate}
                />
              );
            }
            return (
              <Cell
                key={key}
                column={column.key}
                rowId={data.cells.id?.value as string}
                id={key}
                data={cell}
                align={column.align}
                width={column.width}
                formatter={column.formatter}
                showValue={!hideValue}
              />
            );
          })}
      </TableRow>
      {data.children && (
        <TableRow>
          <TableCell
            style={{ padding: 0 }}
            colSpan={tableMeta.columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table
                rows={data.children}
                meta={{
                  name: `${id}-sub`,
                  columns: tableMeta.columns,
                  sortColumns: tableMeta.sortColumns,
                  nested: tableMeta.nested,
                  showHeaders: false,
                  filter: null,
                  hideSensitive: tableMeta.hideSensitive,
                }}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
