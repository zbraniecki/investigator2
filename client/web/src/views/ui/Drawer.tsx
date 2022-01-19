import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Drawer from "@mui/material/Drawer";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ListIcon from "@mui/icons-material/List";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import { useMatch, NavLink } from "react-router-dom";
import { MenuItem } from "./Menu";
import { DialogTab } from "./modal/edit/Dialog";

interface Props {
  menuItems: Array<MenuItem>;
  updateDialogState: any;
}

export default function InvestigatorDrawer({
  menuItems,
  updateDialogState,
}: Props) {
  const index = Boolean(useMatch(`/`));

  function isSelected(item: MenuItem): boolean {
    if (useMatch(`/${item.id}/*`)) {
      return true;
    }
    if (item.default) {
      return index;
    }
    return false;
  }

  const handleHoldingOpen = () => {
    updateDialogState({
      open: true,
      editable: {
        quantity: true,
        asset: true,
        account: true,
      },
      selectedTab: DialogTab.Holding,
    });
  };

  const actions = [
    {
      icon: <MonetizationOnIcon />,
      name: "Holding",
      action: handleHoldingOpen,
    },
    { icon: <ListIcon />, name: "Portfolio" },
    { icon: <ShowChartIcon />, name: "Watchlist" },
    { icon: <PieChartOutlineIcon />, name: "Strategy" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiPaper-root": {
          position: "inherit",
        },
      }}
    >
      <List sx={{ overflow: "hidden" }}>
        {menuItems.map((item) => (
          <ListItemButton
            selected={isSelected(item)}
            component={NavLink}
            to={`/${item.id}`}
            key={`drawer-list-item-${item.id}`}
          >
            <ListItemIcon
              sx={{
                minWidth: "",
              }}
            >
              {item.icon}
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
      <SpeedDial
        id="main-speed-dial"
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 28, left: 0, zIndex: 100 }}
        FabProps={{ size: "small", style: { backgroundColor: "#444444" } }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onMouseDown={(event) => event.preventDefault()}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Drawer>
  );
}
