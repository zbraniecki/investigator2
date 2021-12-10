import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import { Logo } from "./bar/Logo";
import { Controls } from "./bar/Controls";
import { PaletteMode } from "@mui/material";
import { InfoDisplayMode } from "../../components/settings";

interface Props {
  setLightMode: any;
  lightModeName: PaletteMode;
  infoDisplayMode: InfoDisplayMode;
}

export default function InvestigatorAppBar({
  setLightMode,
  lightModeName,
  infoDisplayMode,
}: Props) {
  return (
    <AppBar
      position="static"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0.5rem 0",
      }}
    >
      <Logo lightModeName={lightModeName} />
      <Box sx={{ flex: 1 }} />
      <Controls
        infoDisplayMode={infoDisplayMode}
        lightModeName={lightModeName}
        setLightMode={setLightMode}
      />
    </AppBar>
  );
}
