// import React from "react";
// import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
// import Typography from "@mui/material/Typography";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import { Component as Table, Props as TableProps } from "../components/Table";
import { TableContainer } from "../components/table/Contrainer";
import { TableData, Formatter, CellAlign } from "../components/table/Data";
import {
  WatchlistTableRow,
  prepareWatchlistTableData,
} from "../../utils/watchlist";
import {
  getAssetInfo,
  getWatchlists as getPublicWatchlists,
  Watchlist,
} from "../../store/oracle";
import {
  getPortfolios,
  getWatchlists as getUserWatchlists,
  //   getUsers,
  //   getSession,
} from "../../store/account";
// import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
// import { percent } from "../../utils/formatters";
// import { SearchInput } from "../components/Search";

const tableMeta: TableData = {
  name: "watchlist",
  // sort: {
  //   column: "market_cap",
  //   direction: "desc",
  // },
  // nested: false,
  headers: [
    {
      label: "#",
      key: "market_cap_rank",
      align: CellAlign.Right,
      width: "10%",
    },
    {
      label: "Name",
      key: "name",
      align: CellAlign.Left,
      width: "15%",
      formatter: Formatter.Symbol,
    },
    {
      label: "Price",
      key: "price",
      align: CellAlign.Left,
      width: "auto",
      formatter: Formatter.Currency,
      editable: true,
    },
    {
      label: "1h",
      key: "price_change_percentage_1h",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
    {
      label: "24h",
      key: "price_change_percentage_24h",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
    {
      label: "7d",
      key: "price_change_percentage_7d",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
    {
      label: "30d",
      key: "price_change_percentage_30d",
      align: CellAlign.Left,
      width: "10%",
      formatter: Formatter.Percent,
      // colorDiff: true,
    },
  ],
  // pager: true,
  // header: true,
  // outline: true,
};

export function Watchlists() {
  const publicWatchlists: Record<string, Watchlist> =
    useSelector(getPublicWatchlists);
  const userWatchlists: Record<string, Watchlist> =
    useSelector(getUserWatchlists);
  const assetInfo = useSelector(getAssetInfo);
  const portfolios = useSelector(getPortfolios);
  //   const users = useSelector(getUsers);
  //   const session = useSelector(getSession);
  //   const infoDisplayMode = useSelector(getInfoDisplayMode);

  //   const [wIdx, setwIdx] = React.useState(0);
  //   const [searchQuery, setSearchQuery] = React.useState("");
  //   const handleChange = (event: any, newValue: any) => {
  //     setwIdx(newValue);
  //   };

  const watchlists: Record<string, Watchlist> = {};
  for (const list of Object.values(publicWatchlists)) {
    watchlists[list.id] = list;
  }
  for (const list of Object.values(userWatchlists)) {
    watchlists[list.id] = list;
  }

  const tableData = {
    rows: [],
    ...tableMeta,
  };

  if (Object.keys(watchlists).length > 0) {
    const wid = Object.keys(watchlists)[0];
    const data = prepareWatchlistTableData(
      wid,
      watchlists,
      assetInfo,
      portfolios
    );

    if (data?.children) {
      tableData.rows = data.children;
    }
  }
  //   let tableData: Array<WatchlistTableRow> = [];
  //   let subHeaderRow: WatchlistTableRow | undefined;

  //   let tabs: {id: string, name: string}[] = [];
  //   if (session.username) {
  //     let currentUser = users[session.username];
  //     tabs = currentUser.ui.watchlists
  //     .filter((wid: string) => {
  //       return watchlists[wid] !== undefined;
  //     })
  //     .map((wid: string) => {
  //       let watchlist = watchlists[wid];
  //       return {
  //         id: watchlist.id,
  //         name: watchlist.name,
  //       };
  //     });
  //   } else {
  //     tabs = Object.values(watchlists)
  //       .map(wlist => {
  //         return {
  //           id: wlist.id,
  //           name: wlist.name,
  //         };
  //       });
  //   }

  //   if (tabs.length >= wIdx + 1) {
  //     const wid = tabs[wIdx].id;
  //     let data = prepareWatchlistTableData(
  //       wid,
  //       watchlists,
  //       assetInfo,
  //       portfolios
  //     );
  //     if (data !== undefined) {
  //       let { cells, children } = data;
  //       if (children !== undefined) {
  //         subHeaderRow = {
  //           cells,
  //           type: "asset",
  //         };
  //         tableData = children;
  //       }
  //     }
  //   }

  //   const handleSearch = (event: any) => {
  //   console.log(event);
  //     setSearchQuery(event.target.value);
  //   };

  //       <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", borderBottom: 1, borderColor: "divider" }}>
  //         <Box sx={{ flex: 1 }}>
  //           <Box>
  //             <Tabs value={wIdx} onChange={handleChange}>
  //               {tabs.map((tab) => (
  //                 <Tab key={`tab-${tab.id}`} label={tab.name} />
  //               ))}
  //             </Tabs>
  //           </Box>
  //         </Box>
  //         <SearchInput handleChange={handleSearch} />
  //       </Box>
  //       <Table
  //         meta={tableMeta}
  //         data={tableData}
  //         subHeaderRow={subHeaderRow}
  //         hideSensitive={infoDisplayMode === InfoDisplayMode.HideValues}
  //         searchQuery={searchQuery}
  //       />
  return <TableContainer data={tableData} />;
}
