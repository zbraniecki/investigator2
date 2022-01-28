export enum TransactionType {
  Buy = "BY",
  Sell = "SL",
  Withdraw = "WD",
  Deposit = "DP",
  Interest = "IN",
}

export interface Transaction {
  pk: string;
  account: string;
  asset: string;
  type: TransactionType;
  quantity: number;
  timestamp: Date;
}

export interface Holding {
  pk: string;
  asset: string;
  quantity: number;
  account?: string;
  owner?: string;
}

export interface Portfolio {
  pk: string;
  name: string;
  holdings: string[];
  portfolios: string[];
  accounts: string[];
  tags: string[];
  value?: number;
}

export interface User {
  pk: string;
  username: string;
  email: string;
  base_asset: string | null;
  visible_lists: {
    portfolios: string[];
    watchlists: string[];
    strategies: string[];
  };
}

export interface Account {
  pk: string;
  owner: string;
  name: string;
  service: string;
  holdings: string[];
  transactions: Transaction[];
}

export enum AuthenticateState {
  None,
  Authenticating,
  Session,
  Error,
}

export interface Session {
  authenticateState: AuthenticateState;
  token?: string;
  user_pk?: string;
}
