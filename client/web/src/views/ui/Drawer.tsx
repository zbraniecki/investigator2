import { useSelector } from "react-redux";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuItem } from "./chrome/Chrome";
import { getSession } from "../../store/account";

const drawerWidth = 55;

interface Props {
  menuItems: Array<MenuItem>;
}

export default function InvestigatorDrawer({ menuItems }: Props) {
  const session = useSelector(getSession);

  const navigate = useNavigate();

  const handlePageSelect: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { value } = e.currentTarget.dataset;
    navigate(`/${value}`);
  };

  const { pathname } = useLocation();
  let pageState = pathname.substr(1);

  if (!pageState) {
    if (session.username) {
      pageState = "portfolios";
    } else {
      pageState = "watchlists";
    }
  }

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
      <List sx={{ overflow: "hidden" }}>
        {menuItems.map(({ id, icon }) => (
          <ListItemButton
            selected={id === pageState}
            key={`drawer-list-item-${id}`}
            onClick={handlePageSelect}
            data-value={id}
          >
            <ListItemIcon>{icon}</ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
