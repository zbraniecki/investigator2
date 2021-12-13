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
      <TableHead
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
        }}
      >
        <HeaderRow data={data} />
      </TableHead>
      <TableBody>
        {data.rows?.map((row, idx) => {
          const id = `${data.name}-row-${idx}`;
          return <Row id={id} key={id} data={row} headers={data.headers} />;
        })}
      </TableBody>
    </MUITable>
  );
}
