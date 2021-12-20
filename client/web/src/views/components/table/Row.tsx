import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import { useDispatch } from "react-redux";
import { RowData, TableMeta } from "./Data";
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
        {tableMeta.headers
          .filter((header) => header.visible)
          .map((header) => {
            const key = `${id}-${header.key}`;
            const value = data.cells[header.key];
            if (header.editable) {
              return (
                <EditableCell
                  key={key}
                  id={key}
                  value={value}
                  align={header.align}
                  width={header.width}
                  formatter={header.formatter}
                  onCellUpdate={handleCellUpdate}
                />
              );
            }
            return (
              <Cell
                key={key}
                column={header.key}
                rowId={data.cells.id as string}
                id={key}
                value={value}
                align={header.align}
                width={header.width}
                formatter={header.formatter}
              />
            );
          })}
      </TableRow>
      {data.children && (
        <TableRow>
          <TableCell
            style={{ padding: 0 }}
            colSpan={tableMeta.headers.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table
                rows={data.children}
                meta={{
                  name: `${id}-sub`,
                  headers: tableMeta.headers,
                  sortColumns: tableMeta.sortColumns,
                  nested: tableMeta.nested,
                }}
                state={{
                  showHeaders: false,
                }}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
