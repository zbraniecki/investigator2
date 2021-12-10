import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import cyan from "@mui/material/colors/cyan";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector, useDispatch } from "react-redux";
// import {
//   LightMode,
//   InfoDisplayMode,
//   getLightModeName,
// } from "../../components/settings";
// import InvestigatorAppBar from "../AppBar";
// import InvestigatorDrawer from "../Drawer";
// import Content from "../Content";
// import { getLightMode, setLightMode, getInfoDisplayMode } from "../../store/ui";
import { getLightMode, getLightModeName } from "../../store/ui";

export function Chrome() {
  const storedLightMode = useSelector(getLightMode);

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
  // <InvestigatorAppBar
  //   setLightMode={setLightMode}
  //   lightModeName={lightModeName}
  //   infoDisplayMode={infoDisplayMode}
  // />
  // <InvestigatorDrawer menuItems={menuItems} />
  // <Content menuItems={menuItems} />
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }} />
    </ThemeProvider>
  );
}
