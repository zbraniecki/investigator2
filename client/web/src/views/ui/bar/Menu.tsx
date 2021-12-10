import Switch from "@mui/material/Switch";
import { PaletteMode } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import { AuthenticateState } from "../../../store/account";

interface Props {
  anchorEl: any;
  open: boolean;
  handleClose: any;
  session: any;
  handleAccount: any;
  handleClick2: any;
  lightModeName: PaletteMode;
  handleLogout: any;
  handleLoginModalOpen: any;
  setLightMode: any;
}

export function AccountMenu({
  anchorEl,
  open,
  handleClose,
  session,
  handleAccount,
  handleClick2,
  lightModeName,
  handleLogout,
  handleLoginModalOpen,
  setLightMode,
}: Props) {
  return (
    <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableRestoreFocus
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {session.username && (
          <MenuItem sx={{ cursor: "default" }} onClick={handleAccount}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            {session.username}
          </MenuItem>
        )}
        {session.username && <Divider />}
        <MenuItem onClick={handleClick2}>
          <FormControlLabel
            control={<Switch checked={lightModeName === "dark"} size="small" />}
            label="&nbsp;Dark Mode"
          />
        </MenuItem>
        <Divider />
        {session.authenticateState === AuthenticateState.Session ? (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        ) : (
          <MenuItem onClick={handleLoginModalOpen}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Menu>
  );
}
