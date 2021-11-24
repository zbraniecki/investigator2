import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Routes, Route } from "react-router-dom";
import { Portfolios } from "../pages/Portfolios";
import { Wallets } from "../pages/Wallets";
import { Strategy } from "../pages/Strategy";
import { Watchlists } from "../pages/Watchlists";

export default function Content() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Routes>
        <Route path="*" element={<Portfolios />} />
        <Route path="watchlists" element={<Watchlists />} />
        <Route path="strategies" element={<Strategy />} />
        <Route path="wallets" element={<Wallets />} />
      </Routes>
    </Box>
  );
}
