import React from "react";
import MUITableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import { Table } from "./Table";
import { TableMeta, RowData, RowsData } from "./Data";
import { TabRow, TabInfo } from "../Tabs";
import { assert } from "../../../utils/helpers";

export interface Props {
  meta: TableMeta;
  tabs: TabInfo[];
  getTableData: any;
}

export function TableContainer({ meta, tabs, getTableData }: Props) {
  const [filter, setFilter] = React.useState(
    undefined as Record<string, string> | undefined
  );
  const { id } = useParams();

  let tabIdx = 0;
  if (id) {
    const idx = tabs.findIndex((tab) => tab.id === id);
    tabIdx = idx === -1 ? 0 : idx;
  }

  let allRows: RowsData | undefined;
  let visibleRows: RowsData | undefined;
  let summary;

  if (tabIdx < tabs.length) {
    const data = getTableData(tabs[tabIdx].id);
    if (data) {
      summary = data.cells;
      allRows = data.children;
    }
  }

  if (allRows) {
    if (filter) {
      visibleRows = allRows.filter((row) => {
        for (const [key, query] of Object.entries(filter)) {
          if (key in row.cells) {
            const value = row.cells[key];
            assert(typeof value === "string");
            const hasUpperCase = query.toLowerCase() !== query;
            const matchingValue = hasUpperCase ? value : value.toLowerCase();
            const matches = matchingValue.includes(query);
            if (matches) {
              return true;
            }
          }
        }
        return false;
      });
    } else {
      visibleRows = allRows;
    }
  }

  const state = {
    showHeaders: true,
    filter,
  };
  const nested = Boolean(allRows?.some((row: RowData) => row.children));

  return (
    <>
      <TabRow page={meta.name} tabs={tabs} idx={tabIdx} setFilter={setFilter} />

      <MUITableContainer
        component={Paper}
        sx={{ height: "100%", overflowY: "auto" }}
      >
        <Table
          meta={meta}
          rows={visibleRows}
          state={state}
          summary={summary}
          nested={nested}
        />
      </MUITableContainer>
    </>
  );
}
