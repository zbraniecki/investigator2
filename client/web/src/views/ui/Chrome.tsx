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
import { HoldingDialog } from "./edit/Holding";

export function Chrome() {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [tutorialOpen, setTutorialOpen] = React.useState(false);
  const [holdingOpen, setHoldingOpen] = React.useState(false);

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
      element: <Content />,
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
          setHoldingOpen={setHoldingOpen}
        />
        {routes}
      </Box>
      <SettingsDialog
        onOk={onSettingsOk}
        open={settingsOpen}
        setOpen={setSettingsOpen}
      />
      <TutorialDialog open={tutorialOpen} setOpen={setTutorialOpen} />
      <HoldingDialog open={holdingOpen} setOpen={setHoldingOpen} />
    </ThemeProvider>
  );
}
