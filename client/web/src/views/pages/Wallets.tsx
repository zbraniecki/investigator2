import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Component as Table, Props as TableProps } from "../components/Table";
import { prepareWalletTableData } from "../../utils/wallet";
import { getPortfolios, getPortfolioMeta } from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
import { currency, percent } from "../../utils/formatters";

const tableMeta: TableProps["meta"] = {
  id: "wallet",
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
      label: "Yield",
      id: "yield",
      align: "right",
      width: 0.1,
      formatter: "percent",
    },
    {
      label: "Value",
      id: "value",
      align: "right",
      width: 0.1,
      formatter: "currency",
    },
  ],
};

export function Wallets() {
  const portfolios = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const portfolioMeta = useSelector(getPortfolioMeta);
  const wallets = useSelector(getWallets);

  let pid = "uuid";
  if (portfolios.length > 0) {
    pid = portfolios[0].id;
  }
  const tableData = prepareWalletTableData(pid, portfolios, assetInfo, wallets);

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
      <Table meta={tableMeta} data={tableData} />
    </>
  );
}
