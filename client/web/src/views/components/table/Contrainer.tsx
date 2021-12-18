import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MUITableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useParams } from "react-router-dom";
import { Table } from "./Table";
import { TableMeta, RowData, RowsData } from "./Data";
import { TabRow, TabInfo } from "../Tabs";
import { assert } from "../../../utils/helpers";
import { getRowsPerPageOption, setRowsPerPageOption } from "../../../store/ui";

export interface Props {
  meta: TableMeta;
  tabs: TabInfo[];
  getTableData: any;
}

export function TableContainer({ meta, tabs, getTableData }: Props) {
  const dispatch = useDispatch();
  const [filter, setFilter] = React.useState(
    undefined as Record<string, string> | undefined
  );
  const [page, setPage] = React.useState(0);

  const { id } = useParams();
  const rpp = useSelector(getRowsPerPageOption);

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

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any) => {
    dispatch(setRowsPerPageOption(event.target.value));
    setPage(0);
  };

  const handleSetFilter = (query: Record<string, string> | undefined) => {
    setPage(0);
    setFilter(query);
  };

  const showPager = true;

  const visibleRowsCount = visibleRows?.length || 0;

  const slice: [number, number] | undefined =
    rpp === -1 ? undefined : [page * rpp, page * rpp + rpp];

  return (
    <>
      <TabRow
        page={meta.name}
        tabs={tabs}
        idx={tabIdx}
        setFilter={handleSetFilter}
      />

      <MUITableContainer
        component={Paper}
        sx={{ height: showPager ? "97%" : "100%", overflowY: "auto" }}
      >
        <Table
          meta={meta}
          rows={visibleRows}
          slice={slice}
          state={state}
          summary={summary}
        />
      </MUITableContainer>
      {showPager && visibleRowsCount > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 30, 50, { label: "All", value: -1 }]}
          component="div"
          count={visibleRowsCount}
          rowsPerPage={rpp}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}
