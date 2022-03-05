import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PieChartIcon from "@mui/icons-material/PieChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import { Dashboard } from "../../pages/Dashboard";
import { Watchlists } from "../pages/Watchlists";
import { Portfolios } from "../pages/Portfolios";
import { Accounts } from "../pages/Accounts";
import { Strategy } from "../pages/Strategy";

export interface MenuItem {
  id: string;
  label: string;
  paths: string[];
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
    label: "Watchlists",
    paths: [":id"],
    icon: <TrendingUpIcon />,
    element: <Watchlists />,
    default: true,
  },
  {
    id: "portfolios",
    label: "Portfolios",
    paths: [":id"],
    icon: <MonetizationOnIcon />,
    element: <Portfolios />,
  },
  {
    id: "strategies",
    label: "Strategies",
    paths: [":id"],
    icon: <PieChartIcon />,
    element: <Strategy />,
  },
  {
    id: "accounts",
    label: "Accounts",
    paths: [":id"],
    icon: <AccountBalanceIcon />,
    element: <Accounts />,
  },
];

export function getMenuItems(): MenuItem[] {
  // let defaultId = session.username ? "portfolios" : "watchlists";
  // menuItems.forEach(item => {
  //   item.default = item.id === defaultId;
  // });
  return menuItems;
}
