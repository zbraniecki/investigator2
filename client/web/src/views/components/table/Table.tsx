import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { Row } from "./Row";
import { HeaderRow } from "./Header";
import { TableData } from "./Data";

export interface Props {
  data: TableData;
}

export function Table({ data }: Props) {
  return (
    <MUITable>
      <TableHead>
        <HeaderRow data={data} />
      </TableHead>
      <TableBody>
        {data.rows.map((row, idx) => {
          const id = `${data.id}-row-${idx}`;
          return <Row id={id} key={id} data={row} headers={data.headers} />;
        })}
      </TableBody>
    </MUITable>
  );
}
