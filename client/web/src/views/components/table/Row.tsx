import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import { useDispatch } from "react-redux";
import { TableMeta } from "./data/Table";
import { RowData } from "./data/Row";
import { updateCellThunk } from "../../../store/account";
import { Table } from "./Table";
import { Cell, EditableCell } from "./Cell";

export interface Props {
  id: string;
  data: RowData;
  tableMeta: TableMeta;
}
export function Row({ id, data, tableMeta }: Props) {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const handleCellUpdate = async (cid: string, value: number) => {
    console.log("handling cell update");
    return dispatch(updateCellThunk({ value }));
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
            const value = data.cells[column.key];
            const hideValue = column.sensitive && tableMeta.hideSensitive;
            if (column.editable && !hideValue) {
              return (
                <EditableCell
                  key={key}
                  id={key}
                  value={value}
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
                rowId={data.cells.id as string}
                id={key}
                value={value}
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
