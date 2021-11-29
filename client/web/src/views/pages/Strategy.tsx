import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Component as Table, Props as TableProps } from "../components/Table";
import { getPortfolios, getPortfolioMeta } from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
import { getStrategies } from "../../store/strategy";
import { prepareStrategyTableData } from "../../utils/strategy";
import { currency, percent } from "../../utils/formatters";
import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";

const tableMeta: TableProps["meta"] = {
  id: "strategy",
  sort: {
    column: "target",
    direction: "asc",
  },
  headers: [
    {
      label: "Symbol",
      id: "symbol",
      align: "left",
      width: 0.15,
      formatter: "symbol",
    },
    {
      label: "Target",
      id: "target",
      align: "left",
      width: 0.15,
      formatter: "percent",
    },
    {
      label: "Current",
      id: "current",
      align: "left",
      width: "auto",
      formatter: "percent",
    },
    {
      label: "Deviation",
      id: "deviation",
      align: "right",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "Delta",
      id: "delta",
      align: "right",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "USD Delta",
      id: "deltaUsd",
      align: "right",
      width: 0.15,
      formatter: "currency",
      sensitive: true,
    },
  ],
};

export function Strategy() {
  const portfolios = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const portfolioMeta = useSelector(getPortfolioMeta);
  const wallets = useSelector(getWallets);
  const strategies = useSelector(getStrategies);
  const infoDisplayMode = useSelector(getInfoDisplayMode);

  let sid = "uuid";
  let pid = "uuid";
  if (strategies.length > 0) {
    sid = strategies[0].id;
  }
  if (portfolios.length > 0) {
    pid = portfolios[0].id;
  }

  const tableData = prepareStrategyTableData(
    sid,
    portfolios,
    portfolioMeta,
    assetInfo,
    wallets,
    strategies
  );

  let value = "$--.-- | 24h: -.-% | yield: -.-%";
  const pMeta = portfolioMeta[pid];
  if (pMeta !== undefined) {
    value = `${currency(pMeta.value)} | 24h: ${percent(
      pMeta.price_change_percentage_24h
    )} | yield: ${percent(pMeta.yield)}`;
  }

  return (
    <>
      <Typography align="right">Value: {value}</Typography>
      <Table
        meta={tableMeta}
        data={tableData}
        hideSensitive={infoDisplayMode === InfoDisplayMode.HideValues}
      />
    </>
  );
}
