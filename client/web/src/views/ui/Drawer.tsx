import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Drawer from "@mui/material/Drawer";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuItem } from "./Menu";
import { getSession } from "../../store/account";

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
        "& .MuiPaper-root": {
          position: "inherit",
        },
      }}
    >
      <List sx={{ overflow: "hidden" }}>
        {menuItems.map(({ id, icon }) => (
          <ListItemButton
            selected={id === pageState}
            key={`drawer-list-item-${id}`}
            onClick={handlePageSelect}
            data-value={id}
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
