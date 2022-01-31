import React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import { LightMode, getLightModeName } from "../../components/settings";
import { InvestigatorAppBar } from "./AppBar";
import InvestigatorDrawer from "./Drawer";
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
    console.log(state);
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
      element: <Content updateDialogState={updateDialogState} />,
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
        <InvestigatorDrawer
          menuItems={menuItems}
          updateDialogState={updateDialogState}
        />
        {routes}
      </Box>
      <ModalDialog state={dialogState} updateState={updateDialogState} />
    </ThemeProvider>
  );
}
