import React from "react";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { CellAlign, Formatter, formatValue } from "./data/Column";
import { CellData, CellValue } from "./data/Row";
import { tryParseNumber } from "../../../utils/helpers";

interface CellProps {
  id: string;
  data?: CellData<CellValue>;
  align: CellAlign;
  formatter?: Formatter;
  showValue: boolean;
  onClick?: any;
  sx: any;
}

Cell.defaultProps = {
  formatter: undefined,
  data: undefined,
  onClick: undefined,
};

export function Cell({
  id,
  data,
  align,
  formatter,
  showValue,
  onClick,
  sx,
}: CellProps) {
  const displayValue = data?.value
    ? showValue
      ? formatValue(data.value, formatter)
      : "*"
    : "";

  const tSx: Record<string, any> = {};
  if (showValue && data?.color) {
    tSx.color = data.color;
  }
  const cSx: Record<string, any> = { ...sx };
  if (showValue && data?.color) {
    cSx.cursor = onClick ? "pointer" : "auto";
  }
  return (
    <TableCell key={id} onClick={onClick} align={align} sx={cSx}>
      <Typography sx={tSx}>{displayValue}</Typography>
    </TableCell>
  );
}

interface EditableCellProps {
  id: string;
  column: string;
  data: CellData<CellValue>;
  align: CellAlign;
  formatter?: Formatter;
  onCellUpdate: any;
  sx: any;
}

EditableCell.defaultProps = {
  formatter: undefined,
};

export function EditableCell({
  id,
  column,
  data,
  align,
  formatter,
  onCellUpdate,
  sx,
}: EditableCellProps) {
  const [tempValue, setTempValue] = React.useState(null as string | null);
  const [editing, setEditing] = React.useState(false);
  const [updateInProgress, setUpdateInProgress] = React.useState(false);

  const handleDblClick = (event: any) => {
    if (updateInProgress || !onCellUpdate || editing) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setTempValue(data.value.toString());
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
    if (tempValue === null || tempValue === data.value.toString()) {
      return;
    }

    const result = tryParseNumber(tempValue);

    if (result !== undefined) {
      setUpdateInProgress(true);
      onCellUpdate(column, result).then(() => {
        setTempValue(null);
        setUpdateInProgress(false);
      });
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

  const visibleValue = tempValue === null ? data?.value : tempValue;
  return (
    <TableCell
      key={id}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDblClick}
      align={align}
      sx={{ color: updateInProgress ? "action.disabled" : "inherit", ...sx }}
    >
      {editing ? (
        <InputBase
          autoFocus
          placeholder={visibleValue.toString()}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          sx={{
            color: "primary.500",
            "& input": { padding: 0, textAlign: align },
          }}
          value={visibleValue}
        />
      ) : (
        <Typography>{formatValue(visibleValue, formatter)}</Typography>
      )}
    </TableCell>
  );
}
