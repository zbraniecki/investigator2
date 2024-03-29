import { assertUnreachable } from "../utils/helpers";

export enum TransactionType {
  Buy = "BY",
  Sell = "SL",
  Withdraw = "WD",
  Deposit = "DP",
  Interest = "IN",
}

export function getTransactionTypeLabel(input: TransactionType): string {
  switch (input) {
    case TransactionType.Buy: {
      return "Buy";
    }
    case TransactionType.Sell: {
      return "Sell";
    }
    case TransactionType.Withdraw: {
      return "Widthdraw";
    }
    case TransactionType.Deposit: {
      return "Deposit";
    }
    case TransactionType.Interest: {
      return "Interest";
    }
    default: {
      return assertUnreachable(input);
    }
  }
}

export interface Transaction {
  pk: string;
  account: string;
  holding?: string;
  asset: string;
  type: TransactionType;
  quantity: number;
  timestamp: Date;
}

export interface Holding {
  [key: string]: any;
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
  tags: Set<string>;
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
