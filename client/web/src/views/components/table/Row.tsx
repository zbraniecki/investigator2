import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { RowData, HeadersData } from "./Data";

interface CellProps {
  id: string;
  value: string;
  editable?: boolean;
}

Cell.defaultProps = {
  editable: false,
};

function Cell({ id, value: defaultValue, editable }: CellProps) {
  const [tempValue, setTempValue] = React.useState("");
  const [value, setValue] = React.useState(defaultValue);
  const [editing, setEditing] = React.useState(false);

  const handleDblClick = (event: any) => {
    if (!editable) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (!editing) {
      setTempValue(value);
    }
    setEditing(!editing);
  };

  const handleMouseDown = (event: any) => {
    if (event.detail > 1) {
      event.preventDefault();
    }
  };

  const handleBlur = () => {
    if (editing) {
      setTempValue("");
      setEditing(false);
    }
  };

  const handleKeyDown = (event: any) => {
    if (!editing) {
      return;
    }
    if (event.key === "Enter") {
      event.target.blur();
    } else if (event.key === "Escape") {
      setValue(tempValue);
      event.target.blur();
    }
  };

  const handleChange = (event: any) => {
    if (editing) {
      setValue(event.target.value);
    }
  };

  return (
    <TableCell
      key={id}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDblClick}
      sx={{
        bgcolor: editing ? "primary.900" : "inherit",
      }}
    >
      {editing ? (
        <InputBase
          autoFocus
          fullWidth
          placeholder={tempValue}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          sx={{ "& input": { padding: 0 } }}
          value={value}
        />
      ) : (
        <Typography>{value}</Typography>
      )}
    </TableCell>
  );
}

export interface Props {
  id: string;
  data: RowData;
  headers: HeadersData;
}
export function Row({ id, data, headers }: Props) {
  return (
    <TableRow key={id}>
      {headers.map((header) => {
        const key = `${id}-${header.key}`;
        const value = data[header.key];
        return (
          <Cell key={key} id={key} value={value} editable={header.editable} />
        );
      })}
    </TableRow>
  );
}
