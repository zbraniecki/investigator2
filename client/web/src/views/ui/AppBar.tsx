import React from "react";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import clsx from "clsx";
import { styled } from "@mui/system";
import { useSwitch } from "@mui/base/SwitchUnstyled";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LoginModal } from "./chrome/Login";
import { LightMode, InfoDisplayMode, setInfoDisplayMode } from "../../store/ui";
import {
  AuthenticateState,
  getSession,
  setAuthenticateState,
  logoutThunk,
} from "../../store/account";
import { fetchAssetInfoThunk } from "../../store/oracle";

const SwitchRoot = styled("span")`
  display: inline-block;
  position: relative;
  width: 62px;
  height: 34px;
  padding: 7px;
`;

const SwitchInput = styled("input")`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`;

const SwitchThumb = styled("span")(
  ({ theme }) => `
  position: absolute;
  display: block;
  background-color: ${theme.palette.mode === "dark" ? "#333333" : "#001e3c"};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  top: 1px;
  left: 7px;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:before {
    display: block;
    content: "";
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16"><path fill="${encodeURIComponent(
      "#fff"
    )}" d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/></svg>') center center no-repeat;
  }

  &.focusVisible {
    background-color: #79B;
  }

  &.checked {
    transform: translateX(16px);
    
    &:before {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/></svg>') center center no-repeat;
    }
  }
`
);

const SwitchTrack = styled("span")(
  ({ theme }) => `
  background-color: ${theme.palette.mode === "dark" ? "#8796A5" : "#aab4be"};
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: block;
`
);

function MUISwitch(props: any) {
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);

  const stateClasses = {
    checked,
    disabled,
    focusVisible,
  };

  return (
    <Tooltip title="Show values">
      <SwitchRoot className={clsx(stateClasses)}>
        <SwitchTrack>
          <SwitchThumb className={clsx(stateClasses)} />
        </SwitchTrack>
        <SwitchInput {...getInputProps()} />
      </SwitchRoot>
    </Tooltip>
  );
}

interface Props {
  setLightMode: any;
  lightModeName: string;
  infoDisplayMode: InfoDisplayMode;
}

export default function InvestigatorAppBar({
  setLightMode,
  lightModeName,
  infoDisplayMode,
}: Props) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const session = useSelector(getSession);

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick2 = (event: any) => {
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

  const handleRefresh = () => {
    dispatch(fetchAssetInfoThunk({ refresh: true, token: session.token }));
  };

  const handleAccount = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  function handleInfoDisplayModeChange() {
    const newState =
      infoDisplayMode === InfoDisplayMode.ShowAll
        ? InfoDisplayMode.HideValues
        : InfoDisplayMode.ShowAll;
    dispatch(setInfoDisplayMode(newState));
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "1%",
          flex: 1,
        }}
      >
        Wealth Investigator
      </Typography>
      <Toolbar>
        <MUISwitch
          checked={infoDisplayMode === InfoDisplayMode.ShowAll}
          onChange={handleInfoDisplayModeChange}
        />
        <Tooltip title="Refresh values">
          <div>
            <IconButton
              disabled={!session.token}
              sx={{ ml: 2 }}
              onClick={handleRefresh}
            >
              <RefreshIcon />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {session.authenticateState === AuthenticateState.Session ? (
                <Person color="primary" fontSize="small" />
              ) : (
                <Person fontSize="small" />
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>
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
      <LoginModal
        open={loginModalOpen}
        handleClose={handleLoginModalClose}
        authenticateState={session.authenticateState}
      />
    </AppBar>
  );
}
