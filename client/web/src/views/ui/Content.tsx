import React from "react";
import Box from "@mui/material/Box";
import { useOutletContext, Outlet } from "react-router-dom";

type ContextType = { updateDialogState: any };

export interface Props {
  updateDialogState: any;
  smallScreen: boolean;
}

export default function Content({ updateDialogState, smallScreen }: Props) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: smallScreen ? 0 : 3,
        paddingTop: 0,
        height: "calc(100vh - 130px)",
      }}
    >
      <Outlet context={{ updateDialogState }} />
    </Box>
  );
}

export function getOutletContext() {
  return useOutletContext<ContextType>();
}
