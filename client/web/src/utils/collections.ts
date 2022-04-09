import {
  Watchlist,
  WatchlistType,
  Portfolio,
  Account,
  Holding,
  Asset,
  Service,
} from "../types";
import { assert } from "./helpers";

export enum CollectionType {
  Watchlist,
  Holding,
  Asset,
  Portfolio,
  Account,
  Service,
  Tag,
}

export enum CollectionItemType {
  Holding = "Holding",
  Collection = "Collection",
}

type CollectionItemHolding = {
  type: CollectionItemType.Holding;
  value: Holding;
};

type CollectionItemCollection = {
  type: CollectionItemType.Collection;
  value: Collection;
};

export type CollectionItem = CollectionItemHolding | CollectionItemCollection;

export interface Collection {
  items: Set<CollectionItem>;
  type: CollectionType;
  meta: {
    pk: string;
  };
}

export function collectPortfolioHoldings(
  portfolio: Portfolio,
  portfolios: Record<string, Portfolio>,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>,
  preserve: CollectionType[],
  maxDepth: number | null,
  depth: number = 0
): Collection {
  const items: Set<CollectionItem> = new Set(
    Object.values(portfolio.holdings).map((hid) => ({
      type: CollectionItemType.Holding,
      value: holdings[hid],
    }))
  );

  Object.values(portfolio.portfolios).forEach((pid) => {
    const subCollection = collectPortfolioHoldings(
      portfolios[pid],
      portfolios,
      assets,
      accounts,
      holdings,
      preserve,
      maxDepth === null ? null : maxDepth - 1,
      depth + 1
    );
    if (preserve.includes(CollectionType.Portfolio) && depth > 0) {
      items.add({
        type: CollectionItemType.Collection,
        value: subCollection,
      });
    } else {
      for (const item of subCollection.items) {
        items.add(item);
      }
    }
  });

  Object.values(portfolio.accounts).forEach((aid) => {
    const subCollection = collectAccountHoldings(
      accounts[aid],
      portfolios,
      assets,
      accounts,
      holdings,
      preserve,
      maxDepth === null ? null : maxDepth - 1
    );
    if (preserve.includes(CollectionType.Account)) {
      items.add({
        type: CollectionItemType.Collection,
        value: subCollection,
      });
    } else {
      for (const item of subCollection.items) {
        items.add(item);
      }
    }
  });

  if (portfolio.tags.length > 0) {
    const result: Set<string> = new Set();
    Object.values(accounts).forEach((account) => {
      account.holdings.forEach((hid) => {
        const holding = holdings[hid];
        const asset = assets[holding.asset];
        if (portfolio.tags.includes(asset.asset_class)) {
          result.add(hid);
        }
      });
    });
    Array.from(result).forEach((hid) => {
      const holding = holdings[hid];
      items.add({
        value: holding,
        type: CollectionItemType.Holding,
      });
    });
  }

  return {
    items,
    type: CollectionType.Portfolio,
    meta: {
      pk: portfolio.pk,
    },
  };
}

export function collectAccountHoldings(
  account: Account,
  portfolios: Record<string, Portfolio>,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>,
  preserve: CollectionType[],
  maxDepth: number | null
): Collection {
  const items: Set<CollectionItem> = new Set(
    Object.values(account.holdings).map((hid) => ({
      type: CollectionItemType.Holding,
      value: holdings[hid],
    }))
  );

  return {
    items,
    type: CollectionType.Account,
    meta: {
      pk: account.pk,
    },
  };
}

export function collectWatchlistHoldings(
  watchlist: Watchlist,
  watchlists: Record<string, Watchlist>,
  portfolios: Record<string, Portfolio>,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>,
  preserve: CollectionType[],
  maxDepth: number | null,
  depth: number = 0
): Collection {
  const items: Set<CollectionItem> = new Set();

  if (watchlist.type === WatchlistType.Portfolio) {
    assert(watchlist.portfolio);
    const subCollection = collectPortfolioHoldings(
      portfolios[watchlist.portfolio],
      portfolios,
      assets,
      accounts,
      holdings,
      preserve,
      maxDepth === null ? null : maxDepth - 1,
      depth
    );
    if (preserve.includes(CollectionType.Portfolio) && depth > 0) {
      items.add({
        type: CollectionItemType.Collection,
        value: subCollection,
      });
    } else {
      for (const item of subCollection.items) {
        items.add(item);
      }
    }
  }

  return {
    items,
    type: CollectionType.Watchlist,
    meta: {
      pk: watchlist.pk,
    },
  };
}
