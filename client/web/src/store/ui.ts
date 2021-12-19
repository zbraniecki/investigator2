import { createSlice } from "@reduxjs/toolkit";
import { getFromLocalStorage } from "./main";
import {
  LightMode,
  InfoDisplayMode,
  RowsPerPageOption,
} from "../components/settings";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    lightMode: getFromLocalStorage("lightMode", "string", LightMode.Automatic),
    infoDisplayMode: getFromLocalStorage(
      "info-display-mode",
      "string",
      InfoDisplayMode.ShowAll
    ),
    rowsPerPageOption: getFromLocalStorage(
      "rows-per-page-option",
      "number",
      RowsPerPageOption.Count30
    ),
  },
  reducers: {
    setLightMode: (state, { payload }: { payload: LightMode }) => {
      state.lightMode = payload;
    },
    setInfoDisplayMode: (state, { payload }: { payload: InfoDisplayMode }) => {
      state.infoDisplayMode = payload;
    },
    setRowsPerPageOption: (
      state,
      { payload }: { payload: RowsPerPageOption }
    ) => {
      state.rowsPerPageOption = payload;
    },
  },
  extraReducers: {},
});

export const getLightMode = (state: any) => state.ui.lightMode;
export const getInfoDisplayMode = (state: any) => state.ui.infoDisplayMode;
export const getRowsPerPageOption = (state: any) => state.ui.rowsPerPageOption;

export const { setLightMode, setInfoDisplayMode, setRowsPerPageOption } =
  uiSlice.actions;
export default uiSlice.reducer;
