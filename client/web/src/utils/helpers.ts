import { DataRowProps, SymbolNameCell } from "../views/components/Table";

const CATCH_ALL_KEY = "?";

export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || condition);
  }
}

export enum GroupingStrategy {
  Always,
  IfSame,
  Sum,
};

function isSame(a: SymbolNameCell | string | number | undefined, b: SymbolNameCell | string | number | undefined): boolean {
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === "object" && typeof b === "object") {
    return a.name === b.name && a.symbol === b.symbol;
  }
  return a === b;
}

function groupRows(
  row: DataRowProps,
  keyColumn: string,
  grouped: Record<string, DataRowProps[]>,
  flattenPortfolios: boolean) {
  if (row.type === "portfolio" && flattenPortfolios) {
    if (row.children !== undefined) {
      row.children.forEach((row) => groupRows(row, keyColumn, grouped, flattenPortfolios));
      row.children = undefined;
    }
  } else {
    let key = row.cells[keyColumn];
    if (key === undefined) {
      if (!grouped.hasOwnProperty(CATCH_ALL_KEY)) {
        grouped[CATCH_ALL_KEY] = [];
      }
      grouped[CATCH_ALL_KEY].push(row);
    } else {
      if (typeof key === "object") {
        key = `${key.name}/${key.symbol}`;
      }
      if (!grouped.hasOwnProperty(key)) {
        grouped[key] = [];
      }
      grouped[key].push(row);
    }
  }
}

export function groupTableDataByColumn2(
  data: DataRowProps[],
  keyColumn: string,
  flattenPortfolios: boolean,
): Record<string, DataRowProps[]> {
  let grouped: Record<string, DataRowProps[]> = {};

  data.forEach((row) => groupRows(row, keyColumn, grouped, flattenPortfolios));

  return grouped;
}

export function computeGroupedTableData(
  data: Record<string, DataRowProps[]>,
  columns: string[],
): Record<string, any> {
  let result: Record<string, Record<string, any>> = {};
  for (let [key, entries] of Object.entries(data)) {
    result[key] = {};
    for (let column of columns) {
      result[key][column] = entries.reduce((total, row) => {
        assert(typeof row.cells.value === "number");
        return total + row.cells.value;
      }, 0);
    }
  }
  return result;
}

export function groupTableDataByColumn(
  data: DataRowProps[],
  keyColumn: string,
  groupColumns: {key: string, strategy: GroupingStrategy}[],
  flattenPortfolios: boolean,
): DataRowProps[] {
  let grouped = groupTableDataByColumn2(data, keyColumn, flattenPortfolios);

  let result: DataRowProps[] = Object.values(grouped).map((children) => {
    assert(children.length > 0);
    if (children.length === 1) {
      return children[0];
    }

    let totalValue = children.reduce((total, curr) => {
      if (!curr.cells.value) {
        return total;
      }
      assert(typeof curr.cells.value === "number");
      return total + curr.cells.value;
    }, 0);

    let totalYield = children.reduce((total, curr) => {
      if (!curr.cells.yield) {
        return total;
      }
      assert(typeof curr.cells.yield === "number");
      assert(typeof curr.cells.value === "number");
      const perc = curr.cells.value / totalValue;
      return total + (curr.cells.yield * perc);
    }, 0);

    let cells: DataRowProps["cells"] = {
      value: totalValue,
      yield: totalYield,
    };

    for (const groupColumn of groupColumns) {
      switch (groupColumn.strategy) {
        case GroupingStrategy.IfSame: {
          let values = children.map(child => child.cells[groupColumn.key]);

          let allSame = true;
          for (const v of values) {
            if (!isSame(v, values[0])) {
              allSame = false;
            }
          }
          if (allSame && values[0]) {
            cells[groupColumn.key] = values[0];
            children.forEach(child => {
              child.cells[groupColumn.key] = undefined;
            });
          } else {
            cells[groupColumn.key] = undefined;
          }
          break;
        }
        case GroupingStrategy.Always: {
          break;
        }
        case GroupingStrategy.Sum: {
          let value = children.reduce((total, child) => {
            let v = child.cells[groupColumn.key];
            if (v) {
              assert(typeof v === "number");
              return total + v;
            } else {
              return total;
            }
          }, 0);
          cells[groupColumn.key] = value;
          break;
        }
      }
    }

    return {
      cells,
      children,
      type: "asset",
    };
  });

  return result;
}
