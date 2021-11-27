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

function saveToLocalStorage(state: any) {
  localStorage.setItem("lightMode", state.ui.lightMode);
  if (state.account.session.token) {
    localStorage.setItem("token", state.account.session.token);
    localStorage.setItem("username", state.account.session.username);
    localStorage.setItem("authState", state.account.session.authenticateState);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("authState");
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
