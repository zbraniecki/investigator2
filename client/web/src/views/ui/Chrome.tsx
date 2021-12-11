import React from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";
import {
  LightMode,
  InfoDisplayMode,
  getLightModeName,
} from "../../components/settings";
import { InvestigatorAppBar } from "./AppBar";
// import InvestigatorDrawer from "../Drawer";
// import Content from "../Content";
import { getLightMode, setLightMode, getInfoDisplayMode } from "../../store/ui";

export function Chrome() {
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
  // <InvestigatorDrawer menuItems={menuItems} />
  // <Content menuItems={menuItems} />
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InvestigatorAppBar
        setLightMode={setLightMode}
        lightModeName={lightModeName}
        infoDisplayMode={infoDisplayMode}
      />
      <Box sx={{ flex: 1 }} />
    </ThemeProvider>
  );
}
