import MUITableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Table } from "./Table";
import { TableData } from "./Data";

export interface Props {
  data: TableData;
}

export function TableContainer({ data }: Props) {
  return (
    <MUITableContainer
      component={Paper}
      sx={{ height: "100%", overflowY: "auto" }}
    >
      <Table data={data} />
    </MUITableContainer>
  );
}
