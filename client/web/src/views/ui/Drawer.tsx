import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 60;

interface Props {
  menuItems: Array<[string, React.ReactNode]>;
}

export default function InvestigatorDrawer({ menuItems }: Props) {
  const navigate = useNavigate();

  const handlePageSelect: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { value } = e.currentTarget.dataset;
    navigate(`/${value}`);
  };

  const { pathname } = useLocation();
  const pageState = pathname.substr(1);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map(([name, icon]) => (
          <ListItemButton
            selected={name === pageState}
            key={`drawer-list-item-${name}`}
          >
            <ListItemIcon data-value={name} onClick={handlePageSelect}>
              {icon}
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}