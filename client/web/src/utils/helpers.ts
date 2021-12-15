import { RowData, RowsData, RowType } from "../views/components/table/Data";

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
}

function isSame(
  a: string | number | undefined,
  b: string | number | undefined
): boolean {
  if (typeof a !== typeof b) {
    return false;
  }
  return a === b;
}

function groupRows(
  row: RowData,
  keyColumn: string,
  grouped: Record<string, RowsData>,
  flattenPortfolios: boolean
) {
  if (row.type === RowType.Portfolio && flattenPortfolios) {
    if (row.children !== undefined) {
      row.children.forEach((subRow) =>
        groupRows(subRow, keyColumn, grouped, flattenPortfolios)
      );
      row.children = undefined;
    }
  } else {
    const key = row.cells[keyColumn];
    if (key === undefined) {
      if (!(CATCH_ALL_KEY in grouped)) {
        grouped[CATCH_ALL_KEY] = [];
      }
      grouped[CATCH_ALL_KEY].push(row);
    } else {
      if (!(key in grouped)) {
        grouped[key] = [];
      }
      grouped[key].push(row);
    }
  }
}

export function groupTableDataByColumn2(
  data: RowsData,
  keyColumn: string,
  flattenPortfolios: boolean
): Record<string, RowsData> {
  const grouped: Record<string, RowsData> = {};

  data.forEach((row) => groupRows(row, keyColumn, grouped, flattenPortfolios));

  return grouped;
}

export function computeGroupedTableData(
  data: Record<string, RowsData>,
  columns: string[]
): Record<string, any> {
  const result: Record<string, Record<string, any>> = {};
  for (const [key, entries] of Object.entries(data)) {
    result[key] = {};
    for (const column of columns) {
      result[key][column] = entries.reduce((total, row) => {
        assert(typeof row.cells.value === "number");
        return total + row.cells.value;
      }, 0);
    }
  }
  return result;
}

export function groupTableDataByColumn(
  data: RowsData,
  keyColumn: string,
  groupColumns: { key: string; strategy: GroupingStrategy }[],
  flattenPortfolios: boolean
): RowsData {
  const grouped = groupTableDataByColumn2(data, keyColumn, flattenPortfolios);

  const result: RowsData = Object.values(grouped).map((children) => {
    assert(children.length > 0);
    if (children.length === 1) {
      return children[0];
    }

    const totalValue = children.reduce((total, curr) => {
      if (!curr.cells.value) {
        return total;
      }
      assert(typeof curr.cells.value === "number");
      return total + curr.cells.value;
    }, 0);

    const totalYield = children.reduce((total, curr) => {
      if (!curr.cells.yield) {
        return total;
      }
      assert(typeof curr.cells.yield === "number");
      assert(typeof curr.cells.value === "number");
      const perc = curr.cells.value / totalValue;
      return total + curr.cells.yield * perc;
    }, 0);

    const cells: RowData["cells"] = {
      value: totalValue,
      yield: totalYield,
    };

    for (const groupColumn of groupColumns) {
      switch (groupColumn.strategy) {
        case GroupingStrategy.IfSame: {
          const values = children.map((child) => child.cells[groupColumn.key]);

          let allSame = true;
          for (const v of values) {
            if (!isSame(v, values[0])) {
              allSame = false;
            }
          }
          const firstValue = values[0];
          if (allSame && firstValue) {
            cells[groupColumn.key] = firstValue;
            children.forEach((child) => {
              delete child.cells[groupColumn.key];
            });
          } else {
            delete cells[groupColumn.key];
          }
          break;
        }
        case GroupingStrategy.Always: {
          break;
        }
        case GroupingStrategy.Sum: {
          const value = children.reduce((total, child) => {
            const v = child.cells[groupColumn.key];
            if (v) {
              assert(typeof v === "number");
              return total + v;
            }
            return total;
          }, 0);
          cells[groupColumn.key] = value;
          break;
        }
        default: {
          break;
        }
      }
    }

    return {
      cells,
      children,
      type: RowType.Asset,
    };
  });

  return result;
}
