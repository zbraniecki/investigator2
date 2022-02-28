import React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LightMode, getLightModeName } from "../../components/settings";
import { InvestigatorAppBar } from "./AppBar";
import InvestigatorDrawer from "./Drawer";
import BottomDrawer from "./BottomDrawer";
import { getMenuItems } from "./Menu";
import Content from "./Content";
import { getLightMode } from "../../store/ui";
import {
  ModalDialog,
  DialogState,
  mergeDialogState,
  DialogType,
} from "./modal";

export function Chrome() {
  const [dialogState, setDialogState] = React.useState({
    type: DialogType.None,
  } as DialogState);

  const updateDialogState = (state: DialogState) => {
    const newState = mergeDialogState(dialogState, state);
    setDialogState(newState);
  };

  const storedLightMode: LightMode = useSelector(getLightMode);

  const lightModeName = getLightModeName(storedLightMode);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: cyan,
          mode: lightModeName,
        },
      }),
    [lightModeName]
  );
  const smallScreen = !useMediaQuery(theme.breakpoints.up("sm"));

  const menuItems = getMenuItems();

  const children = [];

  for (const item of menuItems) {
    if (item.default) {
      children.push({
        index: true,
        element: item.element,
      });
    }
    children.push({
      path: item.id,
      element: item.element,
      children: item.paths.map((path) => ({
        path,
        element: item.element,
      })),
    });
  }

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Content
          updateDialogState={updateDialogState}
          smallScreen={smallScreen}
        />
      ),
      children,
    },
  ]);

  const setSettingsOpen = () => {
    updateDialogState({
      type: DialogType.Settings,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InvestigatorAppBar
        lightModeName={lightModeName}
        setSettingsOpen={setSettingsOpen}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
        {!smallScreen && (
          <InvestigatorDrawer
            menuItems={menuItems}
            updateDialogState={updateDialogState}
          />
        )}
        {routes}
        {/* {smallScreen && (
          <BottomDrawer
            menuItems={menuItems}
          />
        )} */}
      </Box>
      <ModalDialog state={dialogState} updateState={updateDialogState} />
    </ThemeProvider>
  );
}
