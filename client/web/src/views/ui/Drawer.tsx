/* import { useSelector } from "react-redux"; */
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Drawer from "@mui/material/Drawer";
import { useMatch, NavLink } from "react-router-dom";
import { MenuItem } from "./Menu";
/* import { getSession } from "../../store/account"; */

interface Props {
  menuItems: Array<MenuItem>;
}

export default function InvestigatorDrawer({ menuItems }: Props) {
  /* const session = useSelector(getSession); */
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
