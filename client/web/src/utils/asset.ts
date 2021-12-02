import { AssetInfo } from "../store/oracle";

export function getAsset(id: string, info: AssetInfo[]): AssetInfo | null {
  for (const asset of info) {
    if (asset.id === id) {
      return asset;
    }
  }
  return null;
}
