import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AbcIcon from "@mui/icons-material/Abc";
import SubjectIcon from "@mui/icons-material/Subject";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";

export interface Props {
  anchorEl: any;
  handleMenuClose: any;
}

export function TableMenu({ anchorEl, handleMenuClose }: Props) {
  return (
    <Menu
      id="table-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      MenuListProps={{ dense: true }}
    >
      <MenuItem
        sx={{
          display: "flex",
        }}
      >
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>Name</ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-6px",
            marginLeft: "20px",
            width: "100px",
          }}
        >
          <ToggleButtonGroup size="small" value={["symbol", "name"]}>
            <ToggleButton value="icon">
              <MonetizationOnIcon />
            </ToggleButton>
            <ToggleButton value="symbol">
              <AbcIcon />
            </ToggleButton>
            <ToggleButton value="name">
              <SubjectIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItemIcon>
      </MenuItem>
      <Divider />
      <MenuItem
        sx={{
          display: "flex",
        }}
      >
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>
          Market Cap Rank
        </ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-10px",
            marginLeft: "20px",
            width: "100px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Checkbox />
        </ListItemIcon>
      </MenuItem>
      <MenuItem sx={{ display: "flex" }}>
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>1h</ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-10px",
            marginLeft: "20px",
            width: "100px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Checkbox />
        </ListItemIcon>
      </MenuItem>
      <MenuItem sx={{ display: "flex" }}>
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>24h</ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-10px",
            marginLeft: "20px",
            width: "100px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Checkbox />
        </ListItemIcon>
      </MenuItem>
      <MenuItem sx={{ display: "flex" }}>
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>7d</ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-10px",
            marginLeft: "20px",
            width: "100px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Checkbox />
        </ListItemIcon>
      </MenuItem>
      <MenuItem sx={{ display: "flex" }}>
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>30d</ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-10px",
            marginLeft: "20px",
            width: "100px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Checkbox />
        </ListItemIcon>
      </MenuItem>
      <Divider />
      <MenuItem sx={{ display: "flex" }}>
        <ListItemText sx={{ minWidth: "100px", flex: 1 }}>
          Default layout
        </ListItemText>
        <ListItemIcon
          sx={{
            marginRight: "-10px",
            marginLeft: "20px",
            width: "100px",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <Checkbox />
        </ListItemIcon>
      </MenuItem>
    </Menu>
  );
}
