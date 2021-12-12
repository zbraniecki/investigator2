import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import { PaletteMode } from "@mui/material";
import { Logo } from "./bar/Logo";
import { Controls } from "./bar/Controls";
import { InfoDisplayMode } from "../../components/settings";

interface Props {
  setLightMode: any;
  lightModeName: PaletteMode;
  infoDisplayMode: InfoDisplayMode;
}

export interface AppBarColors {
  primary: string;
  background: string;
  dent: string;
  button: string;
  accent: string;
}

export function InvestigatorAppBar({
  setLightMode,
  lightModeName,
  infoDisplayMode,
}: Props) {
  let colors: AppBarColors = {
    primary: "primary.50",
    background: "transparent",
    dent: "divider",
    button: "primary.50",
    accent: "primary.900",
  };

  if (lightModeName === "light") {
    colors = {
      primary: "primary.50",
      background: "transparent",
      dent: "divider",
      button: "primary.50",
      accent: "primary.500",
    };
  }

  return (
    <AppBar
      position="static"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0.5rem 0",
        zIndex: 10,
      }}
    >
      <Logo colors={colors} />
      <Box sx={{ flex: 1 }} />
      <Controls
        infoDisplayMode={infoDisplayMode}
        lightModeName={lightModeName}
        setLightMode={setLightMode}
        colors={colors}
      />
    </AppBar>
  );
}
