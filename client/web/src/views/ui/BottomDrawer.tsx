import { useMatch, NavLink } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { MenuItem } from "./Menu";

interface Props {
  menuItems: Array<MenuItem>;
}

export default function BottomDrawer({ menuItems }: Props) {
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

  const selectedIdx = menuItems
    .map((item) => isSelected(item))
    .findIndex((val) => val);

  return (
    <BottomNavigation value={selectedIdx} sx={{ backgroundColor: "#333" }}>
      {menuItems.map((item) => (
        <BottomNavigationAction
          component={NavLink}
          to={`/${item.id}`}
          key={`drawer-list-item-${item.id}`}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </BottomNavigation>
  );
}
