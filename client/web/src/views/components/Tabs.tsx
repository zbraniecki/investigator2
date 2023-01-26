import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import { SearchInput } from "./Search";
import { getOutletContext } from "../ui/Content";
import { DialogType } from "../ui/modal/dialog";

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
  handleAddTab: any;
}

export function TabRow({
  page,
  tabs,
  idx,
  setFilter,
  handleMenuOpen,
  handleAddTab,
}: Props) {
  const outletContext = getOutletContext();

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

  function addTab(event: any) {
    handleAddTab(event.currentTarget);
    // outletContext.updateDialogState({
    //   type: DialogType.Watchlist,
    //   meta: {
    //     watchlist: null
    //   }
    // });
  }

  function editTab(id: string, e: any) {
    outletContext.updateDialogState({
      type: DialogType.Watchlist,
      meta: {
        watchlist: id,
      },
    });
    e.preventDefault();
  }

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
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
        }}
      >
        <Tabs value={idx}>
          {tabs.map((tab) => (
            <Tab
              component={NavLink}
              to={`/${page}/${tab.id}`}
              key={`tab-${tab.id}`}
              label={tab.label}
              onContextMenu={editTab.bind(null, tab.id)}
            />
          ))}
        </Tabs>
        {handleAddTab && tabs.length > 0 && (
          <IconButton
            onClick={addTab}
            sx={{
              ":hover > *": {
                color: "primary.light",
              },
            }}
          >
            <AddBoxIcon color="disabled" />
          </IconButton>
        )}
      </Box>
      <Box sx={{ flex: 1 }} />
      <SearchInput handleChange={handleSearch} />
      <IconButton onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>
    </Box>
  );
}
