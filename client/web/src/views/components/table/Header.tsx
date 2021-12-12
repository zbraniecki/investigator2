import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { TableData } from "./Data";

interface CellProps {
  id: string;
  width: string;
  value: string;
}

function Cell({ id, width, value }: CellProps) {
  return (
    <TableCell key={id} sx={{ width }}>
      {value}
    </TableCell>
  );
}

export interface Props {
  data: TableData;
}

export function HeaderRow({ data }: Props) {
  return (
    <TableRow>
      {data.headers.map((header: any) => {
        const id = `${data.id}-header-${header.key}`;
        return (
          <Cell key={id} id={id} width={header.width} value={header.label} />
        );
      })}
    </TableRow>
  );
}
