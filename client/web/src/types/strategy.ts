export interface Strategy {
  id: string;
  portfolio: string;
  targets: Target[];
}

export interface Target {
  asset: string;
  contains: string[];
  percent: number;
}
