import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import useMediaQuery from "@mui/material/useMediaQuery";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PieChartIcon from "@mui/icons-material/PieChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DashboardIcon from '@mui/icons-material/Dashboard';
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
  fetchUserInfoThunk,
  getPortfolios,
  getSession,
  AuthenticateState,
} from "../../../store/account";
import {
  fetchAssetInfoThunk,
  fetchWalletsThunk,
  fetchWatchlistsThunk as fetchPublicWatchlistsThunk,
  getAssetInfo,
  getWallets,
} from "../../../store/oracle";
import { fetchStrategiesThunk } from "../../../store/strategy";
import { Dashboard } from "../../pages/Dashboard";
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
    id: "dashboard",
    icon: <DashboardIcon />,
    element: <Dashboard />,
  },
  {
    id: "watchlists",
    icon: <TrendingUpIcon />,
    element: <Watchlists />,
  },
  {
    id: "portfolios",
    icon: <MonetizationOnIcon />,
    element: <Portfolios />,
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

export function Chrome() {
  const dispatch = useDispatch();

  const storedLightMode = useSelector(getLightMode);
  const session = useSelector(getSession);
  const infoDisplayMode: InfoDisplayMode = useSelector(getInfoDisplayMode);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  let activeMenuItems = Array.from(menuItems);
  if (!session.username) {
    activeMenuItems = activeMenuItems.filter(item => ["wallets"].includes(item.id));
  }

  let defaultId = session.username ? "portfolios" : "watchlists";
  menuItems.forEach(item => {
    item.default = item.id === defaultId;
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
    dispatch(fetchAssetInfoThunk({}));
    dispatch(fetchPublicWatchlistsThunk());
    dispatch(fetchWalletsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (session.token && session.username === undefined) {
      dispatch(fetchUserInfoThunk({ token: session.token }));
    }
  }, [dispatch, session.token, session.username]);

  useEffect(() => {
    if (session.authenticateState === AuthenticateState.Session) {
      dispatch(fetchPortfoliosThunk({ token: session.token }));
      dispatch(fetchStrategiesThunk({ token: session.token }));
      dispatch(fetchUserWatchlistsThunk({ token: session.token }));
    }
  }, [dispatch, session.authenticateState]);

  const portfolios = useSelector(getPortfolios);
  const assets = useSelector(getAssetInfo);
  const wallets = useSelector(getWallets);

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
