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

export interface Collection {
  type: CollectionType;
  pk?: string;
  items?: Set<Collection>;
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
  const items: Set<Collection> = new Set(
    Object.values(portfolio.holdings).map((hid) => ({
      type: CollectionType.Holding,
      pk: hid,
    }))
  );

  // Object.values(portfolio.portfolios).forEach((pid) => {
  //   const subCollection = collectPortfolioHoldings(
  //     portfolios[pid],
  //     portfolios,
  //     assets,
  //     accounts,
  //     holdings,
  //     preserve,
  //     maxDepth === null ? null : maxDepth - 1,
  //     depth + 1
  //   );
  //   if (preserve.includes(CollectionType.Portfolio) && depth > 0) {
  //     items.add({
  //       type: CollectionItemType.Collection,
  //       value: subCollection,
  //     });
  //   } else {
  //     for (const item of subCollection.items) {
  //       items.add(item);
  //     }
  //   }
  // });
  //
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
      items.add(subCollection);
    } else if (subCollection.items) {
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
  portfolios: Record<string, Portfolio>,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>,
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
  watchlists: Record<string, Watchlist>,
  portfolios: Record<string, Portfolio>,
  assets: Record<string, Asset>,
  accounts: Record<string, Account>,
  holdings: Record<string, Holding>,
  preserve: CollectionType[],
  maxDepth: number | null,
  depth: number = 0
): Collection {
  const items: Set<Collection> = new Set();

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
      items.add(subCollection);
    } else if (subCollection.items) {
        for (const item of subCollection.items) {
          items.add(item);
        }
      }
  }

  return {
    items,
    type: CollectionType.Watchlist,
    pk: watchlist.pk,
  };
}

export enum CollectionGroupKey {
  Asset,
}

export function groupCollectionItems(
  input: Collection,
  key: CollectionGroupKey,
  holdings: Record<string, Holding>
): Collection {
  if (!input.items) {
    return input;
  }
  const newItems: Set<Collection> = new Set();
  const assets: Set<string> = new Set();
  Array.from(input.items).forEach((item) => {
    if (item.type == CollectionType.Holding) {
      assert(item.pk);
      const holding = holdings[item.pk];
      assets.add(holding.asset);
    } else if (!item.items) {
        newItems.add(item);
      } else {
        newItems.add(groupCollectionItems(item, key, holdings));
      }
  });
  Array.from(assets).forEach((aid) => {
    newItems.add({
      type: CollectionType.Asset,
      pk: aid,
    });
  });
  return {
    type: input.type,
    pk: input.pk,
    items: newItems,
  };
}
