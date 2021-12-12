// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import PieChartIcon from "@mui/icons-material/PieChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import { Dashboard } from "../../pages/Dashboard";
import { Watchlists } from "../pages/Watchlists";
import { Portfolios } from "../pages/Portfolios";
// import { Wallets } from "../../pages/Wallets";
// import { Strategy } from "../../pages/Strategy";

export interface MenuItem {
  id: string;
  icon: React.ReactNode;
  element: React.ReactElement;
  default?: boolean;
}

const menuItems: Array<MenuItem> = [
  // {
  //   id: "dashboard",
  //   icon: <DashboardIcon />,
  //   element: <Dashboard />,
  // },
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
  // {
  //   id: "strategies",
  //   icon: <PieChartIcon />,
  //   element: <Strategy />,
  // },
  // {
  //   id: "wallets",
  //   icon: <AccountBalanceIcon />,
  //   element: <Wallets />,
  // },
];

export function getMenuItems(): MenuItem[] {
  // let defaultId = session.username ? "portfolios" : "watchlists";
  // menuItems.forEach(item => {
  //   item.default = item.id === defaultId;
  // });
  return menuItems;
}
