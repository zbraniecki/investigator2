import React from "react";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { getOutletContext } from "../../ui/Content";
import { CellAlign, Formatter, formatValue } from "./data/Column";
import { CellData, CellValue } from "./data/Row";

interface CellProps {
  id: string;
  column: string;
  rowId: string;
  data?: CellData<CellValue>;
  align: CellAlign;
  width: string;
  formatter?: Formatter;
  showValue: boolean;
}

Cell.defaultProps = {
  formatter: undefined,
  data: undefined,
};

export function Cell({
  id,
  column,
  rowId,
  data,
  align,
  width,
  formatter,
  showValue,
}: CellProps) {
  const { setAssetCard } = getOutletContext();

  const handleClick = () => {
    setAssetCard(rowId);
  };

  const displayValue = data?.value
    ? showValue
      ? formatValue(data.value, formatter)
      : "*"
    : "";

  const sx: Record<string, any> = {};
  if (data?.color) {
    sx.color = data.color;
  }
  return (
    <TableCell key={id} align={align} sx={{ width }}>
      <Typography sx={sx} onClick={column === "name" ? handleClick : undefined}>
        {displayValue}
      </Typography>
    </TableCell>
  );
}

interface EditableCellProps {
  id: string;
  column: string;
  data: CellData<CellValue>;
  align: CellAlign;
  width: string;
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
  if (input.endsWith(".")) {
    input += "0";
  }
  const parsed = parseFloat(input);
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
  width,
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
    if (tempValue === null || tempValue === data.value) {
      return;
    }

    const result = tryParseNumber(tempValue);

    if (result !== undefined) {
      setUpdateInProgress(true);
      onCellUpdate(column, result).then(
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

  const visibleValue = tempValue === null ? data?.value : tempValue;
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
        <Typography>{formatValue(visibleValue, formatter)}</Typography>
      )}
    </TableCell>
  );
}
