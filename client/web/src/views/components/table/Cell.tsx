import React from "react";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { CellAlign, Formatter, formatValue } from "./data/Column";
import { CellData, CellValue } from "./data/Row";

interface CellProps {
  id: string;
  data?: CellData<CellValue>;
  align: CellAlign;
  formatter?: Formatter;
  showValue: boolean;
  onClick?: any;
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
}: CellProps) {
  const displayValue = data?.value
    ? showValue
      ? formatValue(data.value, formatter)
      : "*"
    : "";

  const sx: Record<string, any> = {};
  if (showValue && data?.color) {
    sx.color = data.color;
  }
  return (
    <TableCell
      key={id}
      onClick={onClick}
      align={align}
      sx={{ cursor: onClick ? "pointer" : "auto" }}
    >
      <Typography sx={sx}>{displayValue}</Typography>
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
}

EditableCell.defaultProps = {
  formatter: undefined,
};

function tryParseNumber(input: string): number | undefined {
  if (input.length === 0) {
    return 0;
  }

  if (input === "-") {
    return -0;
  }
  const parsed = parseFloat(input.endsWith(".") ? `$[input}0` : input);
  if (Number.isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

export function EditableCell({
  id,
  column,
  data,
  align,
  formatter,
  onCellUpdate,
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
      sx={{ color: updateInProgress ? "action.disabled" : "inherit" }}
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
