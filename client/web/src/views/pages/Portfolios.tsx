import React from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Component as Table, Props as TableProps } from "../components/Table";
import { PortfolioTableRow, preparePortfolioTableData } from "../../utils/portfolio";
import { Portfolio, getPortfolios, getUsers, getSession } from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
import { currency, percent } from "../../utils/formatters";
import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";

const tableMeta: TableProps["meta"] = {
  id: "portfolio",
  sort: {
    column: "value",
    direction: "asc",
  },
  nested: true,
  headers: [
    {
      label: "Name",
      id: "name",
      align: "left",
      width: 0.15,
      formatter: "symbol",
    },
    {
      label: "Price",
      id: "price",
      align: "left",
      width: "auto",
      formatter: "currency",
    },
    {
      label: "Wallet",
      id: "wallet",
      align: "right",
      width: 0.2,
    },
    {
      label: "Quantity",
      id: "quantity",
      align: "right",
      width: 0.1,
      formatter: "number",
      sensitive: true,
    },
    {
      label: "Yield",
      id: "yield",
      align: "right",
      width: 0.1,
      formatter: "percent",
      sensitive: true,
    },
    {
      label: "Value",
      id: "value",
      align: "right",
      width: 0.1,
      formatter: "currency",
      sensitive: true,
    },
  ],
  pager: true,
};

export function Portfolios() {
  const portfolios: Record<string, Portfolio> = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const wallets = useSelector(getWallets);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);
  const infoDisplayMode = useSelector(getInfoDisplayMode);

  const [pIdx, setpIdx] = React.useState(0);
  const handleChange = (event: any, newValue: any) => {
    setpIdx(newValue);
  };

  let tableData: Array<PortfolioTableRow> = [];
  let subHeaderRow;

  let currentUser = session.username ? users[session.username] : undefined;
  let plists = currentUser?.ui.portfolios || [];

  let tabs: {id: string, name: string}[] = plists
    .filter((pid: string) => {
      return portfolios[pid] !== undefined;
    })
    .map((pid: string) => {
      let portfolio = portfolios[pid];
      return {
        id: portfolio.id,
        name: portfolio.name,
      };
    });

  if (tabs.length >= pIdx + 1) {
    const pid = tabs[pIdx].id;
    let {
      headerRow,
      data,
    } = preparePortfolioTableData(
      pid,
      portfolios,
      assetInfo,
      wallets
    );
    subHeaderRow = headerRow;
    tableData = data;
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={pIdx} onChange={handleChange}>
              {tabs.map((tab) => (
                <Tab key={`tab-${tab.id}`} label={tab.name} />
              ))}
            </Tabs>
          </Box>
        </Box>
      </Box>
      <Table
        meta={tableMeta}
        data={tableData}
        subHeaderRow={subHeaderRow}
        hideSensitive={infoDisplayMode === InfoDisplayMode.HideValues}
      />
    </>
  );
}
