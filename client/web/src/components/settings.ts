import { PaletteMode } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export enum LightMode {
  Automatic = "auto",
  Light = "light",
  Dark = "dark",
}

export enum InfoDisplayMode {
  ShowAll = "show_all",
  HideValues = "hide_values",
}

export enum RowsPerPageOption {
  Count5 = 5,
  Count10 = 10,
  Count30 = 30,
  Count50 = 50,
  All = -1,
}

export function getLightModeName(storedLightMode: LightMode): PaletteMode {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  const autoLightMode = prefersDarkMode ? LightMode.Dark : LightMode.Light;
  const lightModeName: PaletteMode =
    storedLightMode === LightMode.Automatic ? autoLightMode : storedLightMode;

  return lightModeName;
}
