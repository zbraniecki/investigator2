import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 60;

interface Props {
  menuItems: Array<[string, React.ReactNode]>;
}

export default function InvestigatorDrawer({ menuItems }: Props) {
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
          <ListItem button key={`drawer-list-item-${name}`}>
            <ListItemIcon>{icon}</ListItemIcon>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
