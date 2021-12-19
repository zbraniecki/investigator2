import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import { SearchInput } from "./Search";

export interface TabInfo {
  id: string;
  label: string;
}

interface Props {
  page: string;
  tabs: TabInfo[];
  idx: number;
  setFilter: any;
  handleMenuOpen: any;
}

export function TabRow({ page, tabs, idx, setFilter, handleMenuOpen }: Props) {
  const handleSearch = (event: any) => {
    const query = event.target.value.trim();
    if (query.length === 0) {
      setFilter(undefined);
    } else {
      setFilter({
        name: query,
        symbol: query,
      });
    }
  };

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
              to={`/${page}/${tab.id}`}
              key={`tab-${tab.id}`}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Box>
      <SearchInput handleChange={handleSearch} />
      <IconButton onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>
    </Box>
  );
}
