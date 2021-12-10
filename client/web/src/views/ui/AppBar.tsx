import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from '@mui/material/Box';
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
import CircularProgress from "@mui/material/CircularProgress";
import SsidChartIcon from '@mui/icons-material/SsidChart';
import { LoginModal } from "./chrome/Login";
import { LightMode, InfoDisplayMode, setInfoDisplayMode } from "../../store/ui";
import {
  AuthenticateState,
  getSession,
  setAuthenticateState,
  logoutThunk,
} from "../../store/account";
import { fetchAssetInfoThunk, getAssetUpdated } from "../../store/oracle";

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
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
      "#fff"
    )}" d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>') center center no-repeat;
  }

  &.focusVisible {
    background-color: #79B;
  }

  &.checked {
    transform: translateX(18px);
    
    &:before {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg>') center center no-repeat;
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
  const [refreshInProgress, setRefreshInProgress] = React.useState(false);
  const session = useSelector(getSession);
  let lastUpdate = useSelector(getAssetUpdated);
  if (lastUpdate) {
    lastUpdate = new Date(lastUpdate).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  }

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
    if (refreshInProgress) {
      return;
    }

    setRefreshInProgress(true);
    const promise: any = dispatch(
      fetchAssetInfoThunk({ refresh: true, token: session.token })
    );

    promise.then(() => {
      setRefreshInProgress(false);
    });
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

  let logoColor = lightModeName == "dark" ? "primary.main" : "white":

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
      <Avatar sx={{
        marginLeft: "10px",
        marginRight: "10px",
        bgcolor: "transparent",
        border: "1px solid",
        borderColor: logoColor,
      }} variant="rounded">
        <SsidChartIcon fontSize="large" sx={{ color: logoColor }} />
      </Avatar>
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          color: logoColor,
          borderBottom: "1px solid",
          borderColor: logoColor,
          lineHeight: 1.6,
        }}
      >
        Istare Alma
      </Typography>
      <Box sx={{ flex: 1 }} />
      <Toolbar>
        <MUISwitch
          checked={infoDisplayMode === InfoDisplayMode.ShowAll}
          onChange={handleInfoDisplayModeChange}
        />
        <Tooltip title={`Last updated: ${lastUpdate}\n`}>
          <div>
            <IconButton
              disabled={!session.token || refreshInProgress}
              sx={{ ml: 2 }}
              onClick={handleRefresh}
            >
              {refreshInProgress ? (
                <CircularProgress size="small" />
              ) : (
                <RefreshIcon />
              )}
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
