import Box from "@mui/material/Box";
import { Routes, Route } from "react-router-dom";
import { MenuItem } from "./Menu";

interface Props {
  menuItems: Array<MenuItem>;
}

export default function Content({ menuItems }: Props) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: 3,
        height: "calc(100vh - 80px)",
      }}
    >
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
