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
        {menuItems.map(({ id, icon }) => (
          <ListItemButton
            selected={Boolean(useMatch(`/${id}/*`))}
            component={NavLink}
            to={`/${id}`}
            key={`drawer-list-item-${id}`}
          >
            <ListItemIcon
              sx={{
                minWidth: "",
              }}
            >
              {icon}
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
