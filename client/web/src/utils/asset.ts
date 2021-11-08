import { AssetInfo } from "../store/oracle";

export function getAsset(symbol: string, info: AssetInfo[]): AssetInfo | null {
  for (const asset of info) {
    if (asset.symbol === symbol) {
      return asset;
    }
  }
  return null;
}
