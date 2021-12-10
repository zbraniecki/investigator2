// import React from "react";
// import Box from "@mui/material/Box";
// import { useSelector } from "react-redux";
// import Typography from "@mui/material/Typography";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import { Component as Table, Props as TableProps } from "../components/Table";
// import { Portfolio, getPortfolios, getUsers, getSession } from "../../store/account";
// import { getAssetInfo, getWallets } from "../../store/oracle";
// import { getStrategies } from "../../store/strategy";
// import { StrategyTableRow, prepareStrategyTableData } from "../../utils/strategy";
// import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
// import { currency, percent } from "../../utils/formatters";

// const tableMeta: TableProps["meta"] = {
//   id: "strategy",
//   sort: {
//     column: "target",
//     direction: "desc",
//   },
//   nested: true,
//   headers: [
//     {
//       label: "Name",
//       id: "name",
//       align: "left",
//       width: 0.15,
//       formatter: "symbol",
//     },
//     {
//       label: "Target",
//       id: "target",
//       align: "left",
//       width: 0.15,
//       formatter: "percent",
//     },
//     {
//       label: "Current",
//       id: "current",
//       align: "left",
//       width: "auto",
//       formatter: "percent",
//     },
//     {
//       label: "Deviation",
//       id: "deviation",
//       align: "right",
//       width: 0.1,
//       formatter: "percent",
//     },
//     {
//       label: "Delta",
//       id: "delta",
//       align: "right",
//       width: 0.1,
//       formatter: "percent",
//     },
//     {
//       label: "USD Delta",
//       id: "deltaUsd",
//       align: "right",
//       width: 0.15,
//       formatter: "currency-delta",
//       sensitive: true,
//     },
//   ],
//   pager: true,
//   header: true,
//   outline: true,
// };

// export function Strategy() {
//   const portfolios = useSelector(getPortfolios);
//   const assetInfo = useSelector(getAssetInfo);
//   const wallets = useSelector(getWallets);
//   const strategies = useSelector(getStrategies);
//   const users = useSelector(getUsers);
//   const session = useSelector(getSession);
//   const infoDisplayMode = useSelector(getInfoDisplayMode);

//   const [sIdx, setsIdx] = React.useState(0);
//   const handleChange = (event: any, newValue: any) => {
//     setsIdx(newValue);
//   };

//   let tableData: Array<StrategyTableRow> = [];
//   let subHeaderRow: StrategyTableRow | undefined;

//   let currentUser = session.username ? users[session.username] : undefined;
//   let slists = currentUser?.ui.strategies || [];

//   let tabs: {id: string, name: string}[] = slists
//     .filter((sid: string) => {
//       return strategies[sid] !== undefined;
//     })
//     .map((sid: string) => {
//       let strategy = strategies[sid];
//       return {
//         id: strategy.id,
//         name: strategy.name,
//       };
//     });

//   if (tabs.length >= sIdx + 1) {
//     const sid = tabs[sIdx].id;
//     let data = prepareStrategyTableData(
//       sid,
//       strategies,
//       portfolios,
//       assetInfo,
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

//   return (
//     <>
//       <Box sx={{ display: "flex", flexDirection: "row" }}>
//         <Box sx={{ flexGrow: 1 }}>
//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <Tabs value={sIdx} onChange={handleChange}>
//               {tabs.map((tab) => (
//                 <Tab key={`tab-${tab.id}`} label={tab.name} />
//               ))}
//             </Tabs>
//           </Box>
//         </Box>
//       </Box>
//       <Table
//         meta={tableMeta}
//         data={tableData}
//         subHeaderRow={subHeaderRow}
//         hideSensitive={infoDisplayMode === InfoDisplayMode.HideValues}
//       />
//     </>
//   );
// }
