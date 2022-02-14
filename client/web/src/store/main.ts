import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./ui";
import userReducer from "./user";
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
  localStorage.setItem(
    "portfolio-inline-quantity-transaction-type",
    state.ui.portfolioInlineQuantityTransactionType
  );
  if (state.user.session.token) {
    localStorage.setItem("token", state.user.session.token);
    localStorage.setItem("user_pk", state.user.session.user_pk);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user_pk");
  }
}

const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    oracle: oracleReducer,
    strategy: strategyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // need it to silence Date warning
    }),
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
