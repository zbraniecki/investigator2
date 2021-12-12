import MUITableContainer from "@mui/material/TableContainer";
import { Table } from "./Table";
import { TableData } from "./Data";

export interface Props {
  data: TableData;
}

export function TableContainer({ data }: Props) {
  return (
    <MUITableContainer>
      <Table data={data} />
    </MUITableContainer>
  );
}
