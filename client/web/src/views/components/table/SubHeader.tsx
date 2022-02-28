import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { ColumnMeta, CellAlign, Formatter, formatValue } from "./data/Column";
import { TableMeta, TableSummaryRow } from "./data/Table";
import { CellData, CellValue } from "./data/Row";

interface SubHeaderCellProps {
  id: string;
  data?: CellData<CellValue>;
  align: CellAlign;
  formatter?: Formatter;
  showValue: boolean;
  sx: any;
}

SubHeaderCell.defaultProps = {
  data: undefined,
  formatter: undefined,
};

function SubHeaderCell({
  id,
  data,
  align,
  formatter,
  showValue,
  sx,
}: SubHeaderCellProps) {
  const displayValue = data
    ? showValue
      ? formatValue(data.value, formatter)
      : "*"
    : "";

  return (
    <TableCell
      key={id}
      align={align}
      sx={{
        color: "text.disabled",
        fontSize: "small",
        paddingTop: 0,
        paddingBottom: 0,
        ...sx,
      }}
    >
      {displayValue}
    </TableCell>
  );
}

export interface Props {
  summary?: TableSummaryRow;
  tableMeta: TableMeta;
  minWidths: Record<string, number>;
}

SubHeaderRow.defaultProps = {
  summary: undefined,
};

export function SubHeaderRow({ summary, tableMeta, minWidths }: Props) {
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
        .map((column: ColumnMeta) => {
          const id = `${tableMeta.name}-header-${column.key}`;
          const sx: {
            [key: string]: any;
          } = {
            minWidth: column.minWidth,
            width: column.width,
          };
          if (minWidths[column.key]) {
            sx.display = "none";
            sx[`@media (min-width: ${minWidths[column.key]}px)`] = {
              display: "table-cell",
            };
          }
          const data = summary ? summary[column.key] : undefined;
          const hideValue = column.sensitive && tableMeta.hideSensitive;
          return (
            <SubHeaderCell
              key={id}
              id={id}
              data={data}
              formatter={column.formatter}
              align={column.align}
              showValue={!hideValue}
              sx={sx}
            />
          );
        })}
    </TableRow>
  );
}
