import {
  Watchlist,
  WatchlistType,
  Portfolio,
  Account,
  Holding,
} from "../types";
import { assert } from "./helpers";
import { DataState } from "./state";

export enum CollectionType {
  Watchlist,
  Holding,
  Asset,
  Portfolio,
  Account,
  Service,
  Tag,
}

export interface Collection {
  type: CollectionType;
  pk?: string;
  items?: Set<Collection>;
}

export function collectPortfolioHoldings(
  portfolio: Portfolio,
  data: Required<
    Pick<DataState, "accounts" | "assets" | "holdings" | "portfolios">
  >,
  preserve: CollectionType[],
  maxDepth: number | null,
  depth: number = 0
): Collection {
  const items: Set<Collection> = new Set(
    Object.values(portfolio.holdings).map((hid) => ({
      type: CollectionType.Holding,
      pk: hid,
    }))
  );

  Object.values(portfolio.portfolios).forEach((pid) => {
    const subCollection = collectPortfolioHoldings(
      data.portfolios[pid],
      data,
      preserve,
      maxDepth === null ? null : maxDepth - 1,
      depth + 1
    );
    if (preserve.includes(CollectionType.Portfolio)) {
      items.add(subCollection);
    } else if (subCollection.items) {
      for (const item of subCollection.items) {
        items.add(item);
      }
    }
  });

  Object.values(portfolio.accounts).forEach((aid) => {
    const subCollection = collectAccountHoldings(
      data.accounts[aid],
      data,
      preserve,
      maxDepth === null ? null : maxDepth - 1
    );
    if (preserve.includes(CollectionType.Account)) {
      items.add(subCollection);
    } else if (subCollection.items) {
      for (const item of subCollection.items) {
        items.add(item);
      }
    }
  });

  if (portfolio.tags.size > 0) {
    const result: Set<string> = new Set();
    Object.values(data.accounts).forEach((account) => {
      account.holdings.forEach((hid) => {
        const holding = data.holdings[hid];
        const asset = data.assets[holding.asset];
        if (portfolio.tags.has(asset.asset_class)) {
          result.add(hid);
        }
        const intersect = [...asset.tags].filter((tag) =>
          portfolio.tags.has(tag)
        );
        if (intersect.length > 0) {
          result.add(hid);
        }
      });
    });
    Array.from(result).forEach((hid) => {
      items.add({
        type: CollectionType.Holding,
        pk: hid,
      });
    });
  }

  return {
    items,
    type: CollectionType.Portfolio,
    pk: portfolio.pk,
  };
}

export function collectAccountHoldings(
  account: Account,
  data: Required<
    Pick<DataState, "accounts" | "assets" | "holdings" | "portfolios">
  >,
  preserve: CollectionType[],
  maxDepth: number | null
): Collection {
  const items: Set<Collection> = new Set(
    Object.values(account.holdings).map((hid) => ({
      type: CollectionType.Holding,
      pk: hid,
    }))
  );

  return {
    items,
    type: CollectionType.Account,
    pk: account.pk,
  };
}

export function collectWatchlistHoldings(
  watchlist: Watchlist,
  // data: DataState<"accounts" | "assets" | "holdings" | "portfolios" | "watchlists">,
  data: Required<
    Pick<
      DataState,
      "accounts" | "assets" | "holdings" | "portfolios" | "watchlists"
    >
  >,
  preserve: CollectionType[],
  maxDepth: number | null,
  depth: number = 0
): Collection {
  const items: Set<Collection> = new Set();

  if (watchlist.type === WatchlistType.Portfolio) {
    assert(watchlist.portfolio);
    const subCollection = collectPortfolioHoldings(
      data.portfolios[watchlist.portfolio],
      data,
      preserve,
      maxDepth === null ? null : maxDepth - 1,
      depth
    );
    if (preserve.includes(CollectionType.Portfolio) && depth > 0) {
      items.add(subCollection);
    } else if (subCollection.items) {
      for (const item of subCollection.items) {
        items.add(item);
      }
    }
  } else if (watchlist.type === WatchlistType.Dynamic) {
    watchlist.assets.forEach((asset: string) => {
      items.add({
        type: CollectionType.Asset,
        pk: asset,
      });
    });
  } else if (watchlist.type == WatchlistType.Assets) {
    watchlist.assets.forEach((asset: string) => {
      items.add({
        type: CollectionType.Asset,
        pk: asset,
      });
    });
  }

  return {
    items,
    type: CollectionType.Watchlist,
    pk: watchlist.pk,
  };
}

export enum CollectionGroupKey {
  Asset,
  Account,
}

export function groupCollectionItems(
  input: Collection,
  key: CollectionGroupKey,
  state: {
    holdings: Record<string, Holding>;
  },
  options?: {
    collapseSingle?: boolean;
  }
): Collection {
  if (!input.items) {
    return input;
  }
  const newItems: Set<Collection> = new Set();
  const groups: Map<string, Set<string>> = new Map();
  Array.from(input.items).forEach((item) => {
    if (item.type == CollectionType.Holding) {
      assert(item.pk);
      const holding = state.holdings[item.pk];
      let groupKey;
      switch (key) {
        case CollectionGroupKey.Asset: {
          groupKey = holding.asset;
          break;
        }
        case CollectionGroupKey.Account: {
          groupKey = holding.account;
          break;
        }
      }
      assert(groupKey);
      const map = groups.get(groupKey);
      if (map) {
        map.add(item.pk);
      } else {
        groups.set(groupKey, new Set([item.pk]));
      }
    } else if (!item.items) {
      newItems.add(item);
    } else {
      newItems.add(groupCollectionItems(item, key, state, options));
    }
  });
  Array.from(groups).forEach(([gid, holdings]) => {
    const items = Array.from(holdings).map((hid) => ({
      type: CollectionType.Holding,
      pk: hid,
    }));
    if (options?.collapseSingle && items.length === 1) {
      newItems.add(items[0]);
    } else {
      let groupType;
      switch (key) {
        case CollectionGroupKey.Asset: {
          groupType = CollectionType.Asset;
          break;
        }
        case CollectionGroupKey.Account: {
          groupType = CollectionType.Account;
          break;
        }
      }
      newItems.add({
        type: groupType,
        pk: gid,
        items: new Set(items),
      });
    }
  });
  return {
    type: input.type,
    pk: input.pk,
    items: newItems,
  };
}
