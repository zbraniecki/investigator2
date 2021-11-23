import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Component as Table, Props as TableProps } from "../components/Table";
import { preparePortfolioTableData } from "../../utils/portfolio";
import { getPortfolios, getPortfolioMeta } from "../../store/account";
import { getAssetInfo, getWallets } from "../../store/oracle";
import { currency, percent } from "../../utils/formatters";

const tableMeta: TableProps["meta"] = {
  id: "portfolio",
  headers: [
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
      width: 0.15,
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

export function Portfolios() {
  const portfolios = useSelector(getPortfolios);
  const assetInfo = useSelector(getAssetInfo);
  const portfolioMeta = useSelector(getPortfolioMeta);
  const wallets = useSelector(getWallets);

  let pid = "uuid";
  if (portfolios.length > 0) {
    pid = portfolios[0].id;
  }
  const tableData = preparePortfolioTableData(
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
      <Table meta={tableMeta} data={tableData} />
    </>
  );
}
