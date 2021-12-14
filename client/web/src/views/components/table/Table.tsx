import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { Row } from "./Row";
import { HeaderRow } from "./Header";
import { TableData } from "./Data";
import { assert } from "../../../utils/helpers";

function sortFunc(
   orderBy: string[],
   sortDirection: any,
   a: any,
   b: any
): number {
   const orderKey = orderBy[0];
   assert(orderKey);

   const bottom = sortDirection === "asc" ? Infinity : -Infinity;

   let aval = a.cells[orderKey];
   if (aval === undefined || aval === null || a.type === "catch-all") {
     aval = bottom;
   }
   let bval = b.cells[orderKey];
   if (bval === undefined || bval === null || b.type === "catch-all") {
     bval = bottom;
   }
   if (aval === bval && orderBy.length > 1) {
     return sortFunc(orderBy.slice(1), sortDirection, a, b);
   }

   if (sortDirection === "asc") {
     return aval - bval;
   }
   return bval - aval;
}
export interface Props {
  data: TableData;
}

export function Table({ data }: Props) {

  if (data.rows) {
    data.rows.sort(sortFunc.bind(undefined, ["value", "current"], "desc"));
  }

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
