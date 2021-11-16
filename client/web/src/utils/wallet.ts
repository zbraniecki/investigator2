import { Wallet, WalletAsset } from "../store/oracle";

export function getWallet(id: string, wallets: Wallet[]): Wallet | null {
  for (const wallet of wallets) {
    if (wallet.id === id) {
      return wallet;
    }
  }
  return null;
}

export function getWalletAsset(
  id: string,
  symbol: string,
  wallets: Wallet[]
): WalletAsset | null {
  for (const wallet of wallets) {
    if (wallet.id === id) {
      for (const asset of wallet.currency) {
        if (asset.symbol === symbol) {
          return asset;
        }
      }
      break;
    }
  }
  return null;
}
