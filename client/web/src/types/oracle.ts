export enum WatchlistType {
  Assets = "AS",
  Portfolio = "PL",
  Tag = "TG",
  Dynamic = "DN",
}

export interface Watchlist {
  pk: string;
  owner?: string;
  name: string;
  type: WatchlistType;
  assets: string[];
  portfolio?: string;
  dynamic?: string;
}

export interface Asset {
  pk: string;
  symbol: string;
  name: string;
  asset_class: string;
  tags: Set<string>;
  info: {
    pair: [string, string];
    value: number;
    high_24h: number;
    low_24h: number;
    market_cap_rank: number;
    market_cap: number;
    market_cap_change_percentage_24h: number;
    price_change_percentage_1h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    image: string;
    last_updated: string;
    api_id?: string;
  };
}

export interface ServiceAsset {
  asset_pk: string;
  apy: number;
  yield_type: "ST" | "LP" | "INT";
}

export interface Service {
  pk: string;
  name: string;
  assets: ServiceAsset[];
  type: "WALT" | "CHAC" | "SAAC" | "INAC" | "REAC" | "CRAC" | "LOAN";
  provider_name: string;
}

export interface Category {
  pk: string;
  name: string;
  slug: string;
  parent?: string;
}

export interface Tag {
  pk: string;
  name: string;
  slug: string;
  category?: string;
}
