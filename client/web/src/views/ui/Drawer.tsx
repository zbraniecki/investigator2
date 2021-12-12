import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuItem } from "./Menu";
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
    <Box sx={{
      width: drawerWidth,
    }}>
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
    </Box>
  );
}
