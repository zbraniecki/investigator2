import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { NavLink } from "react-router-dom";
import { SearchInput } from "./Search";

export interface TabInfo {
  id: string;
  label: string;
}

interface Props {
  tabs: TabInfo[];
  idx: number;
}

export function TabRow({ tabs, idx }: Props) {
  const handleSearch = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Tabs value={idx}>
          {tabs.map((tab) => (
            <Tab
              component={NavLink}
              to={`/watchlists/${tab.id}`}
              key={`tab-${tab.id}`}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Box>
      <SearchInput handleChange={handleSearch} />
    </Box>
  );
}
