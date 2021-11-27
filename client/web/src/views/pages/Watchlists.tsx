import React from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Component as Table, Props as TableProps } from "../components/Table";
import {
  WatchlistTableRow,
  prepareWatchlistTableData,
  calculateWatchlistMeta,
} from "../../utils/watchlist";
import {
  getAssetInfo,
  getWatchlists as getPublicWatchlists,
  Watchlist,
} from "../../store/oracle";
import {
  getPortfolios,
  getWatchlists as getUserWatchlists,
} from "../../store/account";
import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
import { percent } from "../../utils/formatters";

const tableMeta: TableProps["meta"] = {
  id: "watchlist",
  sort: {
    column: "market_cap_rank",
    direction: "desc",
  },
  headers: [
    {
      label: "#",
      id: "market_cap_rank",
      align: "left",
      width: 0.1,
    },
    {
      label: "Symbol",
      id: "symbol",
      align: "left",
      width: 0.1,
      formatter: "symbol",
    },
    {
      label: "Name",
      id: "name",
      align: "left",
      width: 0.2,
    },
    {
      label: "Price",
      id: "price",
      align: "left",
      width: "auto",
      formatter: "currency",
    },
    {
      label: "1h",
      id: "price_change_percentage_1h",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "24h",
      id: "price_change_percentage_24h",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "7d",
      id: "price_change_percentage_7d",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "30d",
      id: "price_change_percentage_30d",
      align: "left",
      width: 0.1,
      formatter: "percent",
    },
  ],
};

export function Watchlists() {
  const assetInfo = useSelector(getAssetInfo);
  const publicWatchlists = useSelector(getPublicWatchlists);
  const userWatchlists = useSelector(getUserWatchlists);
  const portfolios = useSelector(getPortfolios);
  const infoDisplayMode = useSelector(getInfoDisplayMode);

  const [wIdx, setwIdx] = React.useState(0);
  const handleChange = (event: any, newValue: any) => {
    setwIdx(newValue);
  };

  let tableData: Array<WatchlistTableRow> = [];
  let value = "1h: -.-% | 24h: -.-% | 7d: -.-% | 30d: -.-%";

  const watchlists: Watchlist[] = Array.from(publicWatchlists);
  watchlists.push(...userWatchlists);

  if (watchlists.length >= wIdx + 1) {
    const wid = watchlists[wIdx].id;
    tableData = prepareWatchlistTableData(
      wid,
      watchlists,
      assetInfo,
      portfolios
    );

    const meta = calculateWatchlistMeta(wid, watchlists, assetInfo, portfolios);
    value = `1h: ${percent(meta.value_change_1h)} | 24h: ${percent(
      meta.value_change_24h
    )} | 7d: ${percent(meta.value_change_7d)} | 30d: ${percent(
      meta.value_change_30d
    )}`;
  }

  const tabs: Array<string> = watchlists.map((wlist: Watchlist) => wlist.name);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={wIdx} onChange={handleChange}>
              {tabs.map((tab) => (
                <Tab key={`tab-${tab}`} label={tab} />
              ))}
            </Tabs>
          </Box>
        </Box>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          Value: {value}
        </Typography>
      </Box>
      <Table
        meta={tableMeta}
        data={tableData}
        hideSensitive={infoDisplayMode === InfoDisplayMode.HideValues}
      />
    </>
  );
}
