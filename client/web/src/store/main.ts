import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./ui";
import accountReducer from "./account";
import oracleReducer from "./oracle";
import strategyReducer from "./strategy";

export function getFromLocalStorage(
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
      return value;
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

function saveToLocalStorage(state: any) {
  localStorage.setItem("lightMode", state.ui.lightMode);
  localStorage.setItem("info-display-mode", state.ui.infoDisplayMode);
  localStorage.setItem("rows-per-page-option", state.ui.rowsPerPageOption);
  if (state.account.session.token) {
    localStorage.setItem("token", state.account.session.token);
  } else {
    localStorage.removeItem("token");
  }
}

const store = configureStore({
  reducer: {
    ui: uiReducer,
    account: accountReducer,
    oracle: oracleReducer,
    strategy: strategyReducer,
  },
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
