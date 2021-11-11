import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import useMediaQuery from "@mui/material/useMediaQuery";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PieChartIcon from "@mui/icons-material/PieChart";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector, useDispatch } from "react-redux";
import InvestigatorAppBar from "../AppBar";
import InvestigatorDrawer from "../Drawer";
import Content from "../Content";
import { LightMode, getLightMode } from "../../../store/ui";
import {
  fetchPortfoliosThunk,
  getPortfolios,
  setPortfoliosMeta,
} from "../../../store/account";
import { fetchAssetInfoThunk, getAssetInfo } from "../../../store/oracle";
import { computePortfoliosMeta } from "../../../utils/portfolio";

const menuItems: Array<[string, React.ReactNode]> = [
  ["Watchlists", <AccountBalanceIcon />],
  ["Portfolios", <TrendingUpIcon />],
  ["Strategies", <PieChartIcon />],
];

const USER_ID = 1;

export function Chrome() {
  const dispatch = useDispatch();

  const storedLightMode = useSelector(getLightMode);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  let lightModeName: PaletteMode;
  switch (storedLightMode) {
    case LightMode.Light:
      lightModeName = "light";
      break;
    case LightMode.Dark:
      lightModeName = "dark";
      break;
    case LightMode.Automatic:
    default:
      lightModeName = prefersDarkMode ? "dark" : "light";
      break;
  }

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: cyan,
          mode: lightModeName,
        },
      }),
    [lightModeName]
  );

  useEffect(() => {
    dispatch(fetchPortfoliosThunk(USER_ID));
    dispatch(fetchAssetInfoThunk());
  }, [dispatch]);

  const portfolios = useSelector(getPortfolios);
  const assets = useSelector(getAssetInfo);
  const meta = computePortfoliosMeta(portfolios, assets);

  useEffect(() => {
    dispatch(setPortfoliosMeta(meta));
  }, [dispatch, meta]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <InvestigatorAppBar />
        <InvestigatorDrawer menuItems={menuItems} />
        <Content />
      </Box>
    </ThemeProvider>
  );
}
