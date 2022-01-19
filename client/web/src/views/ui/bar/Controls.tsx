import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import { PaletteMode } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import { AccountMenu } from "./Menu";
import { Switch } from "../../components/Switch";
import { setInfoDisplayMode, getInfoDisplayMode } from "../../../store/ui";
import { InfoDisplayMode } from "../../../components/settings";
import { getSession } from "../../../store/user";
import { fetchAssetsThunk } from "../../../api/oracle";
import { getAssetUpdated } from "../../../store/oracle";
import { AppBarColors } from "../AppBar";

interface Props {
  lightModeName: PaletteMode;
  setSettingsOpen: any;
  colors: AppBarColors;
}

export function Controls({ lightModeName, setSettingsOpen, colors }: Props) {
  const dispatch = useDispatch();
  const [refreshInProgress, setRefreshInProgress] = React.useState(false);

  const session = useSelector(getSession);
  const lastUpdate = useSelector(getAssetUpdated);
  const infoDisplayMode: InfoDisplayMode = useSelector(getInfoDisplayMode);
  let lastUpdatedFmt = "";

  if (lastUpdate) {
    lastUpdatedFmt = lastUpdate.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  }

  const handleRefresh = () => {
    if (refreshInProgress) {
      return;
    }

    setRefreshInProgress(true);
    const promise: any = dispatch(
      fetchAssetsThunk({ args: { refresh: "true" }, token: session.token })
    );

    promise.then(() => {
      setRefreshInProgress(false);
    });
  };

  const handleInfoDisplayModeChange = () => {
    const newState =
      infoDisplayMode === InfoDisplayMode.ShowAll
        ? InfoDisplayMode.HideValues
        : InfoDisplayMode.ShowAll;
    dispatch(setInfoDisplayMode(newState));
  };

  return (
    <Toolbar>
      <Tooltip title="Hide sensitive values">
        <div>
          <Switch
            checked={infoDisplayMode === InfoDisplayMode.HideValues}
            onChange={handleInfoDisplayModeChange}
            colors={colors}
          />
        </div>
      </Tooltip>
      <Tooltip title={`Last updated: ${lastUpdatedFmt}\n`}>
        <div>
          <IconButton
            disabled={!session.token || refreshInProgress}
            sx={{ ml: 2 }}
            onClick={handleRefresh}
          >
            {refreshInProgress ? (
              <CircularProgress sx={{ color: colors.primary }} size="small" />
            ) : (
              <RefreshIcon
                sx={{ color: session.token ? colors.primary : "" }}
              />
            )}
          </IconButton>
        </div>
      </Tooltip>
      <AccountMenu
        session={session}
        colors={colors}
        lightModeName={lightModeName}
        setSettingsOpen={setSettingsOpen}
      />
    </Toolbar>
  );
}
