import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import { PaletteMode } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Person from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import { AccountMenu } from "./Menu";
import { LoginModal } from "../Login";
import { Switch } from "../../components/Switch";
import { setInfoDisplayMode } from "../../../store/ui";
import { LightMode, InfoDisplayMode } from "../../../components/settings";
import {
  AuthenticateState,
  getSession,
  logoutThunk,
} from "../../../store/account";
import { fetchAssetInfoThunk, getAssetUpdated } from "../../../store/oracle";

interface Props {
  infoDisplayMode: InfoDisplayMode;
  lightModeName: PaletteMode;
  setLightMode: any;
}

export function Controls({
  infoDisplayMode,
  lightModeName,
  setLightMode,
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

  const handleInfoDisplayModeChange = () => {
    const newState =
      infoDisplayMode === InfoDisplayMode.ShowAll
        ? InfoDisplayMode.HideValues
        : InfoDisplayMode.ShowAll;
    dispatch(setInfoDisplayMode(newState));
  };
  return (
    <>
      <Toolbar>
        <Tooltip title="Show values">
          <div>
            <Switch
              checked={infoDisplayMode === InfoDisplayMode.ShowAll}
              onChange={handleInfoDisplayModeChange}
            />
          </div>
        </Tooltip>
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
            <Avatar sx={{ width: 32, height: 32, bgcolor: "divider" }}>
              {session.authenticateState === AuthenticateState.Session ? (
                session.username ? (
                  <Typography color="white">{session.username}</Typography>
                ) : (
                  <Person sx={{ color: "primary.50" }} fontSize="small" />
                )
              ) : (
                <Person sx={{ color: "action.disabled" }} fontSize="small" />
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>
      <AccountMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        session={session}
        handleAccount={handleAccount}
        handleClick2={handleClick2}
        handleLogout={handleLogout}
        lightModeName={lightModeName}
        handleLoginModalOpen={handleLoginModalOpen}
        setLightMode={setLightMode}
      />
      <LoginModal
        open={loginModalOpen}
        handleClose={handleLoginModalClose}
        authenticateState={session.authenticateState}
      />
    </>
  );
}
