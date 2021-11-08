import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Portfolios } from "../pages/Portfolios";

export default function Content() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Portfolios />
    </Box>
  );
}
