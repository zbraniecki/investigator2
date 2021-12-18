import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  TableMeta,
  TableSummaryRow,
  CellAlign,
  CellValue,
  Formatter,
  formatValue,
} from "./Data";

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
  meta: TableMeta;
  nested: boolean;
}

SubHeaderRow.defaultProps = {
  summary: undefined,
};

export function SubHeaderRow({ summary, meta, nested }: Props) {
  return (
    <TableRow>
      {nested && (
        <TableCell
          sx={{
            borderBottom: 0,
            width: "66px",
          }}
        />
      )}
      {meta.headers
        .filter((header) => header.visible)
        .map((header: any) => {
          const id = `${meta.name}-header-${header.key}`;
          const value = summary ? summary[header.key] : undefined;
          return (
            <SubHeaderCell
              key={id}
              id={id}
              width={header.width}
              value={value}
              formatter={header.formatter}
              align={header.align}
            />
          );
        })}
    </TableRow>
  );
}
