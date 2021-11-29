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

export enum RowsPerPageOption {
  Count5,
  Count10,
  Count30,
  Count50,
  All,
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
    rowsPerPageOption: getFromLocalStorage(
      "rows-per-page-option",
      "enum",
      RowsPerPageOption.Count30,
    ),
  },
  reducers: {
    setLightMode: (state, { payload }: { payload: LightMode }) => {
      state.lightMode = payload;
    },
    setInfoDisplayMode: (state, { payload }: { payload: InfoDisplayMode }) => {
      state.infoDisplayMode = payload;
    },
    setRowsPerPageOption: (state, { payload }: { payload: RowsPerPageOption }) => {
      state.rowsPerPageOption = payload;
    },
  },
  extraReducers: {},
});

export const getLightMode = (state: any) => state.ui.lightMode;
export const getInfoDisplayMode = (state: any) => state.ui.infoDisplayMode;
export const getRowsPerPageOption = (state: any) => state.ui.rowsPerPageOption;

export const { setLightMode, setInfoDisplayMode, setRowsPerPageOption } = uiSlice.actions;
export default uiSlice.reducer;
