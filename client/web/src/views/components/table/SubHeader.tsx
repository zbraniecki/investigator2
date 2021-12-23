import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { CellAlign, Formatter, formatValue } from "./data/Column";
import { TableMeta, TableSummaryRow } from "./data/Table";
import { CellValue } from "./data/Row";

interface SubHeaderCellProps {
  id: string;
  width: string;
  value?: CellValue;
  align: CellAlign;
  formatter?: Formatter;
}

SubHeaderCell.defaultProps = {
  value: undefined,
  formatter: undefined,
};

function SubHeaderCell({
  id,
  width,
  value,
  align,
  formatter,
}: SubHeaderCellProps) {
  return (
    <TableCell
      key={id}
      align={align}
      sx={{
        width,
        color: "text.disabled",
        fontSize: "small",
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {formatValue(value, formatter)}
    </TableCell>
  );
}

export interface Props {
  summary?: TableSummaryRow;
  tableMeta: TableMeta;
}

SubHeaderRow.defaultProps = {
  summary: undefined,
};

export function SubHeaderRow({ summary, tableMeta }: Props) {
  return (
    <TableRow>
      {tableMeta.nested && (
        <TableCell
          sx={{
            borderBottom: 0,
            width: "66px",
          }}
        />
      )}
      {tableMeta.columns
        .filter((column) => column.visible)
        .map((column: any) => {
          const id = `${tableMeta.name}-header-${column.key}`;
          const value = summary ? summary[column.key] : undefined;
          return (
            <SubHeaderCell
              key={id}
              id={id}
              width={column.width}
              value={value}
              formatter={column.formatter}
              align={column.align}
            />
          );
        })}
    </TableRow>
  );
}
