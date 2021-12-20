import React from "react";
import Box from "@mui/material/Box";
import { useOutletContext, Outlet } from "react-router-dom";
import { Component as Card } from "../components/Card";

interface Props {}

type ContextType = { setAssetCard: any };

export default function Content({}: Props) {
  const [assetCard, setAssetCard] = React.useState(
    undefined as string | undefined
  );

  const handleCloseCard = () => {
    setAssetCard(undefined);
  };

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
      <Outlet context={{ setAssetCard }} />
      <Card
        meta={{ id: "foo", assetCard, handleCloseCard }}
        data={{ name: { name: "Foo" } }}
      />
    </Box>
  );
}

export function getOutletContext() {
  return useOutletContext<ContextType>();
}
