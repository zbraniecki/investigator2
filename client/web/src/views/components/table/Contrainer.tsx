import React from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import MUITableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useParams } from "react-router-dom";
import { Table } from "./Table";
import { BaseTableMeta, TableSettings, buildTableMeta } from "./data/Table";
import { StyledRowsData } from "./data/Row";
import { TabRow, TabInfo } from "../Tabs";
import { assert } from "../../../utils/helpers";
import {
  useAppDispatch,
  getRowsPerPageOption,
  setRowsPerPageOption,
  getInfoDisplayMode,
} from "../../../store";
import { TableMenu } from "./Menu";
import { InfoDisplayMode } from "../../../components/settings";
import { getOutletContext } from "../../ui/Content";

export interface Props {
  baseMeta: BaseTableMeta;
  settings: TableSettings;
  tabs: TabInfo[];
  getTableData: any;
}

export function TableContainer({
  tabs,
  baseMeta,
  settings,
  getTableData,
}: Props) {
  const [tableSettings, setTableSettings] = React.useState(settings);
  const outletContext = getOutletContext();

  const tableMeta = React.useMemo(
    () => buildTableMeta(baseMeta, tableSettings),
    [baseMeta, tableSettings]
  );

  const setFilter = (query: Record<string, string> | undefined) => {
    const newSettings = JSON.parse(
      JSON.stringify(tableSettings)
    ) as TableSettings;
    newSettings.filter = query;
    setTableSettings(newSettings);
  };

  const dispatch = useAppDispatch();
  const [page, setPage] = React.useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const { id } = useParams();
  const rpp = useSelector(getRowsPerPageOption);

  const infoDisplayMode = useSelector(getInfoDisplayMode);

  {
    const hideSensitive = infoDisplayMode === InfoDisplayMode.HideValues;
    if (hideSensitive !== Boolean(tableSettings.hideSensitive)) {
      const newSettings = JSON.parse(JSON.stringify(tableSettings));
      newSettings.hideSensitive = hideSensitive;
      setTableSettings(newSettings);
    }
  }

  let tabIdx = 0;
  if (id) {
    const idx = tabs.findIndex((tab) => tab.id === id);
    tabIdx = idx === -1 ? 0 : idx;
  }

  let allRows: StyledRowsData | undefined;
  let visibleRows: StyledRowsData | undefined;
  let summary;

  if (tabIdx < tabs.length) {
    const data = getTableData(tabs[tabIdx].id);
    if (data) {
      summary = data.cells;
      allRows = data.children;
    }
  }

  if (allRows) {
    if (tableMeta.filter !== null) {
      visibleRows = allRows.filter((row) => {
        for (const [key, query] of Object.entries(tableMeta.filter || {})) {
          if (key in row.cells) {
            const cell = row.cells[key];
            if (!cell) {
              continue;
            }
            assert(typeof cell.value === "string");
            const hasUpperCase = query.toLowerCase() !== query;
            const matchingValue = hasUpperCase
              ? cell.value
              : cell.value.toLowerCase();
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

  const handleMenuOpen = (event: any) => {
    if (menuAnchorEl) {
      setMenuAnchorEl(null);
    } else {
      setMenuAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleColumnVisibilityChange = (key: string) => {
    const newSettings = JSON.parse(
      JSON.stringify(tableSettings)
    ) as TableSettings;
    if (newSettings.columns === undefined) {
      newSettings.columns = [
        {
          key,
          visible: true,
        },
      ];
    } else {
      const current = newSettings.columns.find((column) => column.key === key);
      if (current) {
        current.visible = !current.visible;
      } else {
        const allKeys = Object.keys(baseMeta.columns);
        const totalIdx = allKeys.findIndex((k) => k === key);
        assert(totalIdx !== undefined);
        let newIdx = 0;
        for (const k of allKeys.slice(0, totalIdx)) {
          if (
            newSettings.columns.length > newIdx &&
            newSettings.columns[newIdx].key === k
          ) {
            newIdx += 1;
          }
        }
        newSettings.columns.splice(newIdx, 0, {
          key,
          visible: true,
        });
      }
    }
    setTableSettings(newSettings);
  };

  return (
    <>
      <TabRow
        page={tableMeta.name}
        tabs={tabs}
        idx={tabIdx}
        setFilter={handleSetFilter}
        handleMenuOpen={handleMenuOpen}
      />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: "0px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            overflow: "auto",
          }}
        >
          <MUITableContainer component={Paper}>
            <Table
              meta={tableMeta}
              rows={visibleRows}
              slice={slice}
              summary={summary}
            />
          </MUITableContainer>
        </Box>
      </Box>
      {showPager && visibleRowsCount > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 30, 50, { label: "All", value: -1 }]}
          component="div"
          count={visibleRowsCount}
          rowsPerPage={rpp}
          page={page}
          sx={{ position: "", height: "52px" }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      <TableMenu
        anchorEl={menuAnchorEl}
        handleMenuClose={handleMenuClose}
        baseMeta={baseMeta}
        tableMeta={tableMeta}
        handleColumnVisibilityChange={handleColumnVisibilityChange}
      />
    </>
  );
}
