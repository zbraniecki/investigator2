import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  handleAddTab: any;
  handleModifyTab: any;
  handleReorderTabs: any;
}

export function TabRow({
  page,
  tabs,
  idx,
  setFilter,
  handleMenuOpen,
  handleAddTab,
  handleModifyTab,
  handleReorderTabs,
}: Props) {
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
  }

  function modifyTab(id: string, event: any) {
    handleModifyTab(id, event.currentTarget);
    event.preventDefault();
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const newTabs = Array.from(tabs);
    const [removed] = newTabs.splice(result.source.index, 1);
    newTabs.splice(result.destination.index, 0, removed);
    handleReorderTabs(newTabs);
    tabs = newTabs;
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tabs" direction="horizontal">
          {(props: any) => (
            <Tabs ref={props.innerRef} {...props.droppableProps} value={idx}>
              {tabs.map((tab, index) => (
                <Draggable
                  key={`tab-${tab.id}`}
                  draggableId={`id-${tab.id}-order${index}`} // must be a string
                  index={index}
                >
                  {(props: any, snapshot: any) => (
                    <Tab
                      ref={props.innerRef}
                      {...props.draggableProps}
                      {...props.dragHandleProps}
                      component={NavLink}
                      to={`/${page}/${tab.id}`}
                      label={tab.label}
                      onContextMenu={modifyTab.bind(null, tab.id)}
                    />
                  )}
                </Draggable>
              ))}
              {props.placeholder}
            </Tabs>
          )}
        </Droppable>
      </DragDropContext>
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
        }}
      >
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
