import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import { PaletteMode } from "@mui/material";
import { Logo } from "./bar/Logo";
import { Controls } from "./bar/Controls";

interface Props {
  lightModeName: PaletteMode;
  setSettingsOpen: any;
}

export interface AppBarColors {
  primary: string;
  background: string;
  dent: string;
  button: string;
  accent: string;
}

export function InvestigatorAppBar({ lightModeName, setSettingsOpen }: Props) {
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
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "1vh 0",
        height: "8vh",
        minHeight: "3em",
        position: "inherit",
      }}
    >
      <Logo colors={colors} />
      <Box sx={{ flex: 1 }} />
      <Controls
        lightModeName={lightModeName}
        setSettingsOpen={setSettingsOpen}
        colors={colors}
      />
    </AppBar>
  );
}
