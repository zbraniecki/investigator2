import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Routes, Route } from "react-router-dom";
import { MenuItem } from "./Menu";

interface Props {
  menuItems: Array<MenuItem>;
}

export default function Content({ menuItems }: Props) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Routes>
        {menuItems.map((item) => (
          <Route
            key={`route-${item.id}`}
            path={item.default ? "*" : item.id}
            element={item.element}
          />
        ))}
      </Routes>
    </Box>
  );
}
