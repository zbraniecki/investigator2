import React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import {
  LightMode,
  InfoDisplayMode,
  getLightModeName,
} from "../../components/settings";
import { InvestigatorAppBar } from "./AppBar";
import InvestigatorDrawer from "./Drawer";
import { getMenuItems } from "./Menu";
import Content from "./Content";
import { getLightMode, setLightMode, getInfoDisplayMode } from "../../store/ui";
import { SettingsDialog } from "./Settings";
import { TutorialDialog } from "./tutorial/Tutorial";
import { HoldingDialog, DialogTab, DialogState } from "./edit/Dialog";

interface UpdateDialogProps {
  open?: boolean;
}

export function Chrome() {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [tutorialOpen, setTutorialOpen] = React.useState(false);
  const [dialogState, setDialogState] = React.useState({
    open: false,
  } as DialogState);

  const updateDialogState = (newState: DialogState) => {
    const v = {
      asset:
        newState.value?.asset === undefined
          ? dialogState.value?.asset
          : newState.value?.asset,
      quantity:
        newState.value?.quantity === undefined
          ? dialogState.value?.quantity
          : newState.value?.quantity,
      account:
        newState.value?.account === undefined
          ? dialogState.value?.account
          : newState.value?.account,
      holding:
        newState.value?.holding === undefined
          ? dialogState.value?.holding
          : newState.value?.holding,
    };
    const e = {
      quantity:
        newState.editable?.quantity === undefined
          ? dialogState.editable?.quantity
          : newState.editable?.quantity,
      asset:
        newState.editable?.asset === undefined
          ? dialogState.editable?.asset
          : newState.editable?.asset,
      account:
        newState.editable?.account === undefined
          ? dialogState.editable?.account
          : newState.editable?.account,
    };
    setDialogState({
      open: newState.open === undefined ? dialogState.open : newState.open,
      value: v,
      editable: e,
      selectedTab:
        newState.selectedTab === undefined
          ? dialogState.selectedTab
          : newState.selectedTab,
    });
  };

  const storedLightMode: LightMode = useSelector(getLightMode);
  const infoDisplayMode: InfoDisplayMode = useSelector(getInfoDisplayMode);

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

  const onSettingsOk = () => {};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InvestigatorAppBar
        setLightMode={setLightMode}
        lightModeName={lightModeName}
        infoDisplayMode={infoDisplayMode}
        setSettingsOpen={setSettingsOpen}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <InvestigatorDrawer
          menuItems={menuItems}
          updateDialogState={updateDialogState}
        />
        {routes}
      </Box>
      <SettingsDialog
        onOk={onSettingsOk}
        open={settingsOpen}
        setOpen={setSettingsOpen}
      />
      <TutorialDialog open={tutorialOpen} setOpen={setTutorialOpen} />
      <HoldingDialog
        state={dialogState}
        updateDialogState={updateDialogState}
      />
    </ThemeProvider>
  );
}
