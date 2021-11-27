import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import useMediaQuery from "@mui/material/useMediaQuery";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PieChartIcon from "@mui/icons-material/PieChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector, useDispatch } from "react-redux";
import InvestigatorAppBar from "../AppBar";
import InvestigatorDrawer from "../Drawer";
import Content from "../Content";
import {
  LightMode,
  getLightMode,
  setLightMode,
  InfoDisplayMode,
  getInfoDisplayMode,
} from "../../../store/ui";
import {
  fetchPortfoliosThunk,
  fetchWatchlistsThunk as fetchUserWatchlistsThunk,
  getPortfolios,
  setPortfoliosMeta,
} from "../../../store/account";
import {
  fetchAssetInfoThunk,
  fetchWalletsThunk,
  fetchWatchlistsThunk as fetchPublicWatchlistsThunk,
  getAssetInfo,
  getWallets,
} from "../../../store/oracle";
import { fetchStrategiesThunk } from "../../../store/strategy";
import { calculatePortfoliosMeta } from "../../../utils/portfolio";
import { Watchlists } from "../../pages/Watchlists";
import { Portfolios } from "../../pages/Portfolios";
import { Wallets } from "../../pages/Wallets";
import { Strategy } from "../../pages/Strategy";

export interface MenuItem {
  id: string;
  icon: React.ReactNode;
  element: React.ReactElement;
  default?: boolean;
}

const menuItems: Array<MenuItem> = [
  {
    id: "watchlists",
    icon: <TrendingUpIcon />,
    element: <Watchlists />,
  },
  {
    id: "portfolios",
    icon: <MonetizationOnIcon />,
    element: <Portfolios />,
    default: true,
  },
  {
    id: "strategies",
    icon: <PieChartIcon />,
    element: <Strategy />,
  },
  {
    id: "wallets",
    icon: <AccountBalanceIcon />,
    element: <Wallets />,
  },
];

const USER_ID = 1;

export function Chrome() {
  const dispatch = useDispatch();

  const storedLightMode = useSelector(getLightMode);
  const infoDisplayMode: InfoDisplayMode = useSelector(getInfoDisplayMode);

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
    dispatch(fetchAssetInfoThunk());
    dispatch(fetchPublicWatchlistsThunk());
    dispatch(fetchUserWatchlistsThunk());
    dispatch(fetchWalletsThunk());
    dispatch(fetchPortfoliosThunk(USER_ID));
    dispatch(fetchStrategiesThunk(USER_ID));
  }, [dispatch]);

  const portfolios = useSelector(getPortfolios);
  const assets = useSelector(getAssetInfo);
  const wallets = useSelector(getWallets);
  const meta = calculatePortfoliosMeta(portfolios, assets, wallets);

  useEffect(() => {
    dispatch(setPortfoliosMeta(meta));
  }, [dispatch, meta]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <InvestigatorAppBar
          setLightMode={setLightMode}
          lightModeName={lightModeName}
          infoDisplayMode={infoDisplayMode}
        />
        <InvestigatorDrawer menuItems={menuItems} />
        <Content menuItems={menuItems} />
      </Box>
    </ThemeProvider>
  );
}
