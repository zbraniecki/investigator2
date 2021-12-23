import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { CellAlign, Formatter, formatValue } from "./data/Column";
import { TableMeta, TableSummaryRow } from "./data/Table";
import { CellData, CellValue } from "./data/Row";

interface SubHeaderCellProps {
  id: string;
  width: string;
  data?: CellData<CellValue>;
  align: CellAlign;
  formatter?: Formatter;
  showValue: boolean;
}

SubHeaderCell.defaultProps = {
  data: undefined,
  formatter: undefined,
};

function SubHeaderCell({
  id,
  width,
  data,
  align,
  formatter,
  showValue,
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
        width,
        color: "text.disabled",
        fontSize: "small",
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {displayValue}
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
          const data = summary ? summary[column.key] : undefined;
          const hideValue = column.sensitive && tableMeta.hideSensitive;
          return (
            <SubHeaderCell
              key={id}
              id={id}
              width={column.width}
              data={data}
              formatter={column.formatter}
              align={column.align}
              showValue={!hideValue}
            />
          );
        })}
    </TableRow>
  );
}
