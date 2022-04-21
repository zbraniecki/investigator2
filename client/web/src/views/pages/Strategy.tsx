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
  isSufficientDataLoaded,
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
      priority: 0,
    },
    target: {
      label: "Target",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Percent,
      editable: true,
      priority: 1,
    },
    current: {
      label: "Current",
      align: CellAlign.Left,
      sortDirection: SortDirection.Desc,
      formatter: Formatter.Percent,
      sensitive: true,
      priority: 0,
    },
    deviation: {
      label: "Deviation",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Percent,
      sensitive: true,
      priority: 4,
    },
    delta: {
      label: "Delta",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Percent,
      sensitive: true,
      priority: 3,
    },
    deltaUsd: {
      label: "USD Delta",
      align: CellAlign.Right,
      sortDirection: SortDirection.Asc,
      formatter: Formatter.Currency,
      sensitive: true,
      priority: 2,
    },
  },
};

const tableSettings: TableSettings = {
  sortColumns: ["target", "current"],
  columns: [
    {
      key: "name",
      visible: true,
      minWidth: 95,
      width: "auto",
    },
    {
      key: "target",
      visible: true,
      minWidth: 115,
      width: 125,
    },
    {
      key: "current",
      visible: true,
      minWidth: 115,
      width: 125,
    },
    {
      key: "deviation",
      visible: true,
      minWidth: 115,
      width: 125,
    },
    {
      key: "delta",
      visible: true,
      minWidth: 115,
      width: 125,
    },
    {
      key: "deltaUsd",
      visible: true,
      minWidth: 115,
      width: 125,
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

  const ready = isSufficientDataLoaded({
    accounts,
    assets,
    holdings,
    portfolios,
    strategies,
    targets,
    targetChanges,
    users,
  });

  if (ready && session.user_pk) {
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

  const getTableData = (id: string): StyledRowData | null => {
    const data = prepareStrategyTableData(id, {
      accounts,
      assets,
      holdings,
      portfolios,
      services,
      strategies,
      targets,
      targetChanges,
    });
    if (data === null) {
      return null;
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
