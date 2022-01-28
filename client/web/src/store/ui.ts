import { createSlice } from "@reduxjs/toolkit";
import { getFromLocalStorage } from "./main";
import {
  LightMode,
  InfoDisplayMode,
  RowsPerPageOption,
} from "../components/settings";
import { TransactionType } from "../types";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    lightMode: getFromLocalStorage("lightMode", "string", LightMode.Automatic),
    infoDisplayMode: getFromLocalStorage(
      "info-display-mode",
      "enum",
      InfoDisplayMode.ShowAll
    ),
    rowsPerPageOption: getFromLocalStorage(
      "rows-per-page-option",
      "number",
      RowsPerPageOption.Count30
    ),
    portfolioInlineQuantityTransactionType: getFromLocalStorage(
      "portfolio-inline-quantity-transaction-type",
      "enum",
      TransactionType.Buy
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
export const getPortfolioInlineQuantityTransactionType = (state: any) =>
  state.ui.portfolioInlineQuantityTransactionType;

export const { setLightMode, setInfoDisplayMode, setRowsPerPageOption } =
  uiSlice.actions;
export default uiSlice.reducer;
