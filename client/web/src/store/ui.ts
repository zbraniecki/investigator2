import { createSlice } from "@reduxjs/toolkit";
import { getFromLocalStorage } from "./main";

export enum LightMode {
  Automatic,
  Light,
  Dark,
}

export enum InfoDisplayMode {
  ShowAll,
  HideValues,
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
