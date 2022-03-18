import React from "react";
import Box from "@mui/material/Box";
import { useOutletContext, Outlet } from "react-router-dom";

type ContextType = { updateDialogState: any; smallScreen: boolean };

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
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Outlet context={{ updateDialogState, smallScreen }} />
    </Box>
  );
}

export function getOutletContext() {
  return useOutletContext<ContextType>();
}
