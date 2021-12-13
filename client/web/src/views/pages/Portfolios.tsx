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
  PortfolioTableRow,
  preparePortfolioTableData,
} from "../../utils/portfolio";
import {
  Portfolio,
  getPortfolios,
  getUsers,
  getSession,
} from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
// import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
// import { currency, percent } from "../../utils/formatters";

const tableMeta: TableData = {
  name: "portfolio",
  //   sort: {
  //     column: "value",
  //     direction: "desc",
  //   },
  //   nested: true,
  headers: [
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
    },
    //     {
    //       label: "Wallet",
    //       id: "wallet",
    //       align: "right",
    //       width: 0.2,
    //     },
    {
      label: "Quantity",
      key: "quantity",
      align: CellAlign.Right,
      width: "10%",
      formatter: Formatter.Number,
      editable: true,
      /* sensitive: true, */
    },
    //     {
    //       label: "Yield",
    //       id: "yield",
    //       align: "right",
    //       width: 0.1,
    //       formatter: "percent",
    //       sensitive: true,
    //     },
    //     {
    //       label: "Value",
    //       id: "value",
    //       align: "right",
    //       width: 0.1,
    //       formatter: "currency",
    //       sensitive: true,
    //     },
  ],
  //   pager: true,
  //   header: true,
  //   outline: true,
};

export function Portfolios() {
  const portfolios: Record<string, Portfolio> = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const wallets = useSelector(getWallets);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);
  //   const infoDisplayMode = useSelector(getInfoDisplayMode);

  //   const [pIdx, setpIdx] = React.useState(0);
  //   const handleChange = (event: any, newValue: any) => {
  //     setpIdx(newValue);
  //   };

  //   let tableData: Array<PortfolioTableRow> = [];
  //   let subHeaderRow: PortfolioTableRow | undefined;

  //   let currentUser = session.username ? users[session.username] : undefined;
  //   let plists = currentUser?.ui.portfolios || [];

  //   let tabs: {id: string, name: string}[] = plists
  //     .filter((pid: string) => {
  //       return portfolios[pid] !== undefined;
  //     })
  //     .map((pid: string) => {
  //       let portfolio = portfolios[pid];
  //       return {
  //         id: portfolio.id,
  //         name: portfolio.name,
  //       };
  //     });

  //   if (tabs.length >= pIdx + 1) {
  //     const pid = tabs[pIdx].id;
  //     let data = preparePortfolioTableData(
  //       pid,
  //       portfolios,
  //       assetInfo,
  //       wallets
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

  const tableData = {
    rows: [],
    ...tableMeta,
  };

  if (Object.keys(portfolios).length > 0) {
    const pid = Object.keys(portfolios)[5];
    const data = preparePortfolioTableData(pid, portfolios, assetInfo, wallets);
    if (data?.children) {
      tableData.rows = data.children;
    }
  }

  //       <Box sx={{ display: "flex", flexDirection: "row" }}>
  //         <Box sx={{ flexGrow: 1 }}>
  //           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
  //             <Tabs value={pIdx} onChange={handleChange}>
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
  return <TableContainer data={tableData} />;
}
