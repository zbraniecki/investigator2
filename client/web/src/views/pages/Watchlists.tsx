// import React from "react";
// import Box from "@mui/material/Box";
// import { useSelector } from "react-redux";
// import Typography from "@mui/material/Typography";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import { Component as Table, Props as TableProps } from "../components/Table";
// import {
//   WatchlistTableRow,
//   prepareWatchlistTableData,
// } from "../../utils/watchlist";
// import {
//   getAssetInfo,
//   getWatchlists as getPublicWatchlists,
//   Watchlist,
// } from "../../store/oracle";
// import {
//   getPortfolios,
//   getWatchlists as getUserWatchlists,
//   getUsers,
//   getSession,
// } from "../../store/account";
// import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
// import { percent } from "../../utils/formatters";
// import { SearchInput } from "../components/Search";

// const tableMeta: TableProps["meta"] = {
//   id: "watchlist",
//   sort: {
//     column: "market_cap",
//     direction: "desc",
//   },
//   nested: false,
//   headers: [
//     {
//       label: "#",
//       id: "market_cap_rank",
//       align: "right",
//       width: 0.01,
//     },
//     {
//       label: "Name",
//       id: "name",
//       align: "left",
//       width: 0.15,
//       formatter: "symbol",
//     },
//     {
//       label: "Price",
//       id: "price",
//       align: "left",
//       width: "auto",
//       formatter: "currency",
//     },
//     {
//       label: "1h",
//       id: "price_change_percentage_1h",
//       align: "left",
//       width: 0.1,
//       formatter: "percent",
//       colorDiff: true,
//     },
//     {
//       label: "24h",
//       id: "price_change_percentage_24h",
//       align: "left",
//       width: 0.1,
//       formatter: "percent",
//       colorDiff: true,
//     },
//     {
//       label: "7d",
//       id: "price_change_percentage_7d",
//       align: "left",
//       width: 0.1,
//       formatter: "percent",
//       colorDiff: true,
//     },
//     {
//       label: "30d",
//       id: "price_change_percentage_30d",
//       align: "left",
//       width: 0.1,
//       formatter: "percent",
//       colorDiff: true,
//     },
//   ],
//   pager: true,
//   header: true,
//   outline: true,
// };

// export function Watchlists() {
//   const publicWatchlists: Record<string, Watchlist> = useSelector(getPublicWatchlists);
//   const userWatchlists: Record<string, Watchlist> = useSelector(getUserWatchlists);
//   const assetInfo = useSelector(getAssetInfo);
//   const portfolios = useSelector(getPortfolios);
//   const users = useSelector(getUsers);
//   const session = useSelector(getSession);
//   const infoDisplayMode = useSelector(getInfoDisplayMode);

//   const [wIdx, setwIdx] = React.useState(0);
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const handleChange = (event: any, newValue: any) => {
//     setwIdx(newValue);
//   };

//   const watchlists: Record<string, Watchlist> = {};
//   for (let list of Object.values(publicWatchlists)) {
//     watchlists[list.id] = list;
//   }
//   for (let list of Object.values(userWatchlists)) {
//     watchlists[list.id] = list;
//   }

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

//   return (
//     <>
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
//     </>
//   );
// }
