import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import { useDispatch } from "react-redux";
import { RowData, TableData, CellAlign, CellValue, Formatter } from "./Data";
import { percent, currency, number } from "../../../utils/formatters";
import { updateCellThunk } from "../../../store/account";
import { Table } from "./Table";

interface CellProps {
  id: string;
  value: CellValue;
  align: CellAlign;
  width: string;
  formatter?: Formatter;
  onCellUpdate?: any;
}

Cell.defaultProps = {
  formatter: undefined,
  onCellUpdate: undefined,
};

function tryParseNumber(input: string): number | undefined {
  if (input.length === 0) {
    return 0;
  }

  if (input === "-") {
    return -0;
  }
  if (input.endsWith(".")) {
    input += "0";
  }
  const parsed = parseFloat(input);
  if (Number.isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

function Cell({
  id,
  value,
  align: cellAlign,
  width,
  formatter,
  onCellUpdate,
}: CellProps) {
  const [tempValue, setTempValue] = React.useState(null as string | null);
  const [editing, setEditing] = React.useState(false);
  const [updateInProgress, setUpdateInProgress] = React.useState(false);

  const handleDblClick = (event: any) => {
    if (updateInProgress || !onCellUpdate || editing) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setTempValue(value.toString());
    setEditing(true);
  };

  const handleMouseDown = (event: any) => {
    if (event.detail > 1) {
      event.preventDefault();
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setTempValue(null);
  };

  const tryCommitChange = () => {
    if (tempValue === null || tempValue === value) {
      return;
    }

    const result = tryParseNumber(tempValue);

    if (result !== undefined) {
      setUpdateInProgress(true);
      onCellUpdate("cell-id", result).then(
        ({ payload }: { payload: { error: string | null } }) => {
          if (payload.error !== null) {
          }
          setTempValue(null);
          setUpdateInProgress(false);
        }
      );
    }
  };

  const handleBlur = () => {
    tryCommitChange();
    setEditing(false);
  };

  const handleKeyDown = (event: any) => {
    if (!editing) {
      return;
    }
    if (event.key === "Enter") {
      tryCommitChange();
      setEditing(false);
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  };

  const handleChange = (event: any) => {
    if (editing) {
      switch (formatter) {
        case Formatter.Currency: {
          const result = tryParseNumber(event.target.value);
          if (result !== undefined) {
            setTempValue(event.target.value);
          }
          break;
        }
        case Formatter.Number: {
          const result = tryParseNumber(event.target.value);
          if (result !== undefined) {
            setTempValue(event.target.value);
          }
          break;
        }
        default: {
          setTempValue(event.target.value);
          break;
        }
      }
    }
  };

  const align = cellAlign === CellAlign.Left ? "left" : "right";

  function formatValue(input: CellValue): string {
    let formattedValue: string;
    if (input === undefined || input === null) {
      return "";
    }
    switch (formatter) {
      case Formatter.Currency: {
        formattedValue = currency(input);
        break;
      }
      case Formatter.Percent: {
        formattedValue = percent(input);
        break;
      }
      case Formatter.Number: {
        formattedValue = number(input);
        break;
      }
      default: {
        formattedValue = input.toString();
        break;
      }
    }
    return formattedValue;
  }

  const visibleValue = tempValue === null ? value : tempValue;
  return (
    <TableCell
      key={id}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDblClick}
      align={align}
      sx={{ color: updateInProgress ? "action.disabled" : "inherit", width }}
    >
      {editing ? (
        <InputBase
          autoFocus
          fullWidth
          placeholder={visibleValue.toString()}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          sx={{ color: "primary.500", "& input": { padding: 0 } }}
          value={visibleValue}
        />
      ) : (
        <Typography>{formatValue(visibleValue)}</Typography>
      )}
    </TableCell>
  );
}

export interface Props {
  id: string;
  data: RowData;
  tableData: TableData;
  nested: boolean;
}
export function Row({ id, data, tableData, nested }: Props) {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const handleCellUpdate = async (id: string, value: number) => {
    console.log("handling cell update");
    return dispatch(updateCellThunk({ value }));
  };

  return (
    <>
      <TableRow key={id}>
        {nested && (
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
        {tableData.headers
          .filter((header) => header.visible)
          .map((header) => {
            const key = `${id}-${header.key}`;
            const value = data.cells[header.key];
            return (
              <Cell
                key={key}
                id={key}
                value={value}
                align={header.align}
                width={header.width}
                formatter={header.formatter}
                onCellUpdate={header.editable ? handleCellUpdate : undefined}
              />
            );
          })}
      </TableRow>
      {data.children && (
        <TableRow>
          <TableCell
            style={{ padding: 0 }}
            colSpan={tableData.headers.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table
                data={{
                  name: `${id}-sub`,
                  sortColumns: tableData.sortColumns,
                  headers: tableData.headers,
                  rows: data.children,
                }}
                headers={false}
                nested={nested}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
