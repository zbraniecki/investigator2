import React from "react";
import { useSelector } from "react-redux";
import { TableContainer } from "../components/table/Contrainer";
import {
  CellAlign,
  SortDirection,
  Formatter,
} from "../components/table/data/Column";
import { BaseTableMeta, TableSettings } from "../components/table/data/Table";
import { StyledRowData } from "../components/table/data/Row";
import {
  getPortfolios,
  getUsers,
  getSession,
  getHoldings,
  getAccounts,
  getAssets,
  getServices,
  getStrategies,
  getTargets,
  getTargetChanges,
} from "../../store";
import {
  prepareStrategyTableData,
  computeStrategyTableDataStyle,
} from "../../utils/strategy";
import { TabInfo } from "../components/Tabs";

const baseTableMeta: BaseTableMeta = {
  name: "strategy",
  nested: true,
  showHeaders: true,
  columns: {
    name: {
      label: "Name",
      align: CellAlign.Left,
      sortDirection: SortDirection.Asc,
      // width: "15%",
    },
    target: {
      label: "Target",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      // width: "15%",
      formatter: Formatter.Percent,
      editable: true,
    },
    current: {
      label: "Current",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      // width: "auto",
      formatter: Formatter.Percent,
      sensitive: true,
    },
    deviation: {
      label: "Deviation",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      // width: "10%",
      formatter: Formatter.Percent,
      sensitive: true,
    },
    delta: {
      label: "Delta",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      // width: "10%",
      formatter: Formatter.Percent,
      sensitive: true,
    },
    deltaUsd: {
      label: "USD Delta",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      // width: "15%",
      formatter: Formatter.Currency,
      sensitive: true,
    },
  },
};

const tableSettings: TableSettings = {
  sortColumns: ["target", "current"],
  columns: [
    {
      key: "name",
      visible: true,
    },
    {
      key: "target",
      visible: true,
    },
    {
      key: "current",
      visible: true,
    },
    {
      key: "deviation",
      visible: true,
    },
    {
      key: "delta",
      visible: true,
    },
    {
      key: "deltaUsd",
      visible: true,
    },
  ],
};

export function Strategy() {
  const portfolios = useSelector(getPortfolios);
  const assets = useSelector(getAssets);
  const accounts = useSelector(getAccounts);
  const strategies = useSelector(getStrategies);
  const targets = useSelector(getTargets);
  const targetChanges = useSelector(getTargetChanges);
  const users = useSelector(getUsers);
  const session = useSelector(getSession);
  const holdings = useSelector(getHoldings);
  const services = useSelector(getServices);

  let tabs: TabInfo[] = [];

  const ready =
    Object.keys(strategies).length > 0 &&
    Object.keys(users).length > 0 &&
    Object.keys(targets).length > 0 &&
    Object.keys(targetChanges).length > 0 &&
    session.user_pk;

  if (ready) {
    const wids: string[] = users[session.user_pk].visible_lists.strategies;

    tabs = wids
      .filter((sid) => sid in strategies)
      .map((sid) => {
        const strategy = strategies[sid];
        return {
          id: strategy.pk,
          label: strategy.name,
        };
      });
  }

  const getTableData = (id: string): StyledRowData | undefined => {
    const data = prepareStrategyTableData(
      id,
      strategies,
      targets,
      targetChanges,
      portfolios,
      holdings,
      assets,
      accounts,
      services
    );
    if (data === undefined) {
      return undefined;
    }
    return computeStrategyTableDataStyle(data);
  };

  return (
    <TableContainer
      tabs={tabs}
      baseMeta={baseTableMeta}
      settings={tableSettings}
      getTableData={getTableData}
    />
  );
}
