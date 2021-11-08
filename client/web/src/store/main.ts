import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./ui";
import accountReducer from "./account";
import oracleReducer from "./oracle";

function saveToLocalStorage(state: any) {
  localStorage.setItem("lightMode", state.ui.lightMode);
}

const store = configureStore({
  reducer: {
    ui: uiReducer,
    account: accountReducer,
    oracle: oracleReducer,
  },
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
