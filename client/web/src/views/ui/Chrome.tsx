import React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";
import { useRoutes, RouteObject } from "react-router-dom";
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
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = getMenuItems();

  const children: RouteObject[] = menuItems.flatMap((item) => {
    const result = [];
    if (item.default) {
      result.push({
        index: true,
        element: item.element,
      });
    }
    result.push({
      path: item.id,
      element: item.element,
      children: item.paths.map((path) => ({
        path,
        element: item.element,
      })),
    });

    return result;
  });

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
      {!smallScreen && (
        <Box sx={{ display: "flex", flexDirection: "row", height: "92vh" }}>
          <InvestigatorDrawer
            menuItems={menuItems}
            updateDialogState={updateDialogState}
          />
          {routes}
        </Box>
      )}
      {smallScreen && (
        <>
          {routes}
          <BottomDrawer menuItems={menuItems} />
        </>
      )}
      <ModalDialog state={dialogState} updateState={updateDialogState} />
    </ThemeProvider>
  );
}
