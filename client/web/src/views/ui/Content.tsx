import React from "react";
import Box from "@mui/material/Box";
import { useOutletContext, Outlet } from "react-router-dom";

type ContextType = { setHoldingState: any };

export interface Props {
  setHoldingState: any;
}

export default function Content({ setHoldingState }: Props) {
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
      <Outlet context={{ setHoldingState }} />
    </Box>
  );
}

export function getOutletContext() {
  return useOutletContext<ContextType>();
}
