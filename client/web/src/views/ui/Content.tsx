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
        paddingTop: 0,
        height: "calc(100vh - 130px)",
      }}
    >
      <Routes>
        {menuItems.map((item) => (
          <Route
            key={`route-${item.id}-${item.paths[0]}`}
            path={item.paths[0]}
            element={item.element}
          >
            {item.paths.slice(1).map((path) => (
              <Route
                key={`route-${item.id}-${path}`}
                path={path}
                element={item.element}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </Box>
  );
}
