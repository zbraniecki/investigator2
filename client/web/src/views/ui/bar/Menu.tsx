import React from "react";
import { useSelector, useDispatch } from "react-redux";
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
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { LightMode } from "../../../components/settings";
import { AppBarColors } from "../AppBar";
import { LoginModal } from "../Login";
import { AuthenticateState, getUsers, logoutThunk } from "../../../store/user";

interface Props {
  session: any;
  colors: AppBarColors;
  lightModeName: PaletteMode;
  setLightMode: any;
  setSettingsOpen: any;
}

export function AccountMenu({
  session,
  colors,
  lightModeName,
  setLightMode,
  setSettingsOpen,
}: Props) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const users = useSelector(getUsers);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLightModeChange = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const mode = lightModeName === "dark" ? LightMode.Light : LightMode.Dark;
    dispatch(setLightMode(mode));
    return false;
  };

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutThunk({ token: session.token }));
  };

  const handleAccount = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const handleSettings = (event: any) => {
    setSettingsOpen(true);
  };

  const currentUser = users[session.user_pk];

  let accountIcon;
  if (currentUser) {
    accountIcon = (
      <Typography sx={{ color: colors.accent }}>
        {currentUser.username[0].toUpperCase()}
      </Typography>
    );
  } else {
    accountIcon = <Person sx={{ color: colors.accent }} fontSize="small" />;
  }

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary }}>
            {accountIcon}
          </Avatar>
        </IconButton>
      </Tooltip>
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
        {currentUser && (
          <MenuItem sx={{ cursor: "default" }} onClick={handleAccount}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            {currentUser.username}
          </MenuItem>
        )}
        {currentUser && <Divider />}
        {currentUser && (
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        )}
        <MenuItem onClick={handleLightModeChange}>
          <FormControlLabel
            control={<Switch checked={lightModeName === "dark"} size="small" />}
            label="&nbsp;Dark Mode"
          />
        </MenuItem>
        <Divider />
        {currentUser ? (
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
      <LoginModal
        open={loginModalOpen}
        handleClose={handleLoginModalClose}
        authenticateState={session.authenticateState}
      />
    </>
  );
}
