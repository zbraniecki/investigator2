import { PaletteMode } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export enum LightMode {
  Automatic,
  Light,
  Dark,
}

export enum InfoDisplayMode {
  ShowAll,
  HideValues,
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

  let lightModeName: PaletteMode = prefersDarkMode ? "dark" : "light";

  switch (storedLightMode) {
    case LightMode.Light:
      lightModeName = "light";
      break;
    case LightMode.Dark:
      lightModeName = "dark";
      break;
    default:
      break;
  }
  return lightModeName;
}
