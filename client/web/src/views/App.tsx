import { Provider } from "react-redux";
import store from "../store/main";

import { Chrome } from "./ui/chrome/Chrome";

export function App() {
  return (
    <Provider store={store}>
      <Chrome />
    </Provider>
  );
}
