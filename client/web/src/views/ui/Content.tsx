import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Portfolios } from "../pages/Portfolios";
import { Wallets } from "../pages/Wallets";

interface Props {
  page: string;
}

export default function Content({ page }: Props) {
  let selectedPage;

  switch (page) {
    case "Wallets":
      selectedPage = <Wallets />;
      break;
    case "Portfolios":
    default:
      selectedPage = <Portfolios />;
      break;
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      {selectedPage}
    </Box>
  );
}
