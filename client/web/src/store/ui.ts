import { createSlice } from "@reduxjs/toolkit";

export enum LightMode {
  Automatic,
  Light,
  Dark,
}

export enum InfoDisplayMode {
  ShowAll,
  HideValues,
}

function getFromLocalStorage(
  key: string,
  type: "enum" | "string" | "number",
  def: any
): any {
  const value = localStorage.getItem(key);
  if (value === null) {
    return def;
  }
  switch (type) {
    case "enum": {
      return parseInt(value, 10);
    }
    case "string": {
      return value;
    }
    case "number": {
      return parseInt(value, 10);
    }
    default: {
      throw new Error("Unknown type");
    }
  }
}

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    lightMode: getFromLocalStorage("theme", "enum", LightMode.Automatic),
    infoDisplayMode: getFromLocalStorage(
      "info-display-mode",
      "enum",
      InfoDisplayMode.ShowAll
    ),
  },
  reducers: {
    setLightMode: (state, { payload }: { payload: LightMode }) => {
      state.lightMode = payload;
    },
    setInfoDisplayMode: (state, { payload }: { payload: InfoDisplayMode }) => {
      state.infoDisplayMode = payload;
    },
  },
  extraReducers: {},
});

export const getLightMode = (state: any) => state.ui.lightMode;
export const getInfoDisplayMode = (state: any) => state.ui.infoDisplayMode;

export const { setLightMode, setInfoDisplayMode } = uiSlice.actions;
export default uiSlice.reducer;
