export interface Strategy {
  pk: string;
  portfolio: string;
  targets: Array<string>;
  changes: Record<string, string>;
}

export interface Target {
  pk: string;
  asset: string;
  contains: string[];
  strategy: string;
  percent: number;
}

export interface TargetChange {
  pk: string;
  strategy: string;
  asset: string;
  change: number;
  timestamp: Date;
}
