import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Drawer from "@mui/material/Drawer";
import ListIcon from "@mui/icons-material/List";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import { useMatch, NavLink } from "react-router-dom";
import { MenuItem } from "./Menu";

interface Props {
  menuItems: Array<MenuItem>;
}

export default function BottomDrawer({
  menuItems,
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
    </Drawer>
  );
}
