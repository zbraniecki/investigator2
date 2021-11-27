import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Component as Table, Props as TableProps } from "../components/Table";
import { prepareWalletTableData } from "../../utils/wallet";
import { getPortfolios, getPortfolioMeta } from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
import { InfoDisplayMode, getInfoDisplayMode } from "../../store/ui";
import { currency, percent } from "../../utils/formatters";

const tableMeta: TableProps["meta"] = {
  id: "wallet",
  sort: {
    column: "value",
    direction: "asc",
  },
  headers: [
    {
      label: "Wallet",
      id: "wallet",
      align: "left",
      width: 0.2,
    },
    {
      label: "Symbol",
      id: "symbol",
      align: "left",
      width: 0.6,
      formatter: "symbol",
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
      label: "Value",
      id: "value",
      align: "right",
      width: 0.1,
      formatter: "currency",
      sensitive: true,
    },
  ],
};

export function Wallets() {
  const portfolios = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const portfolioMeta = useSelector(getPortfolioMeta);
  const wallets = useSelector(getWallets);
  const infoDisplayMode = useSelector(getInfoDisplayMode);

  let pid = "uuid";
  if (portfolios.length > 0) {
    pid = portfolios[0].id;
  }
  const tableData = prepareWalletTableData(
    pid,
    portfolios,
    portfolioMeta,
    assetInfo,
    wallets
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
