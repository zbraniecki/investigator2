import React from "react";
import { useSelector, useDispatch } from "react-redux";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { AssetContent, AssetHeader } from "./pages/Asset";
import { HoldingContent, HoldingHeader, HoldingActions } from "./pages/Holding";
import { AccountContent, AccountHeader } from "./pages/Account";
import {
  getSession,
  getUsers,
  getAccounts,
  Account,
  Holding,
  getPortfolios,
  getHoldings,
} from "../../../store/user";
import {
  getAssetInfo,
  getTaxonomies,
  Category,
  Tag,
  Service,
  AssetInfo,
  getServices,
} from "../../../store/oracle";
import { assert } from "../../../utils/helpers";

export enum DialogTab {
  Asset = 0,
  Holding = 1,
  Account = 2,
}

export interface DialogState {
  open: boolean;
  selectedTab?: DialogTab;
  value?: {
    asset?: string | null;
    account?: string | null;
    quantity?: string | null;
    holding?: string | null;
  };
  editable?: {
    asset?: boolean;
    quantity?: boolean;
    account?: boolean;
  };
}

export interface ResolvedDialogState {
  open: boolean;
  selectedTab: DialogTab;
  value: {
    asset: string | null;
    account: string | null;
    quantity: string | null;
    holding: string | null;
  };
  editable: {
    asset: boolean;
    quantity: boolean;
    account: boolean;
  };
  assetClass?: Tag;
  asset?: AssetInfo;
  account?: Account;
  holding?: Holding;
  quantity?: number;
}

interface Props {
  state: DialogState;
  updateDialogState: any;
}

export function HoldingDialog({ state, updateDialogState }: Props) {
  const session = useSelector(getSession);
  const users = useSelector(getUsers);
  const assetInfo = useSelector(getAssetInfo);
  const taxonomies = useSelector(getTaxonomies);
  const accounts = useSelector(getAccounts);
  const portfolios = useSelector(getPortfolios);
  const holdings = useSelector(getHoldings);

  const resolveDialogState = (state: DialogState): ResolvedDialogState => {
    console.log(`resolving dialog state`);
    let asset;
    let assetClass;
    let account;
    let holding;
    let quantity;
    if (state.value?.holding) {
      for (const a of Object.values<Account>(accounts)) {
        for (const hid of a.holdings) {
          if (hid === state.value.holding) {
            account = a;
            holding = holdings[hid];
            asset = assetInfo[holding.asset];
            assetClass = taxonomies.tags[asset.asset_class];
            quantity = holding.quantity;
            break;
          }
        }
      }
    } else {
      if (state.value?.asset) {
        const info = assetInfo[state.value.asset];
        assert(info);
        asset = info;
        assetClass = taxonomies.tags[asset.asset_class];
      }
      if (state.value?.account) {
        const info = accounts[state.value.account];
        assert(info);
        account = info;
      }
      if (state.value && state.value.quantity !== undefined) {
        if (state.value.quantity === null) {
        } else {
          const q = parseFloat(state.value.quantity);
          if (!isNaN(q)) {
            quantity = q;
          }
        }
      }
    }
    return {
      open: state.open,
      selectedTab: state.selectedTab ?? DialogTab.Asset,
      value: {
        asset: state.value?.asset || null,
        account: state.value?.account || null,
        quantity: state.value?.quantity ?? quantity?.toString() ?? null,
        holding: state.value?.holding || null,
      },
      editable: {
        asset: state.editable?.asset || false,
        quantity: state.editable?.quantity || false,
        account: state.editable?.account || false,
      },
      asset,
      assetClass,
      account,
      holding,
      quantity,
    };
  };

  const resolvedDialogState = resolveDialogState(state);

  const handleCancel = () => {
    updateDialogState({ open: false });
  };

  const handleHoldingClick = (event: any) => {
    updateDialogState({ selectedTab: DialogTab.Holding });
  };

  const handleAccountClick = (event: any) => {
    updateDialogState({ selectedTab: DialogTab.Account });
  };

  let content;
  let header;
  let actions;
  switch (resolvedDialogState.selectedTab) {
    case DialogTab.Holding: {
      header = (
        <HoldingHeader
          state={resolvedDialogState}
          assetInfo={assetInfo}
          accounts={accounts}
          updateDialogState={updateDialogState}
        />
      );
      content = (
        <HoldingContent
          state={resolvedDialogState}
          accounts={accounts}
          updateDialogState={updateDialogState}
        />
      );
      actions = (
        <HoldingActions
          state={resolvedDialogState}
          session={session}
          users={users}
          updateDialogState={updateDialogState}
        />
      );
      break;
    }
    case DialogTab.Account: {
      header = <AccountHeader />;
      content = <AccountContent />;
      break;
    }
    case DialogTab.Asset:
    default: {
      header = <AssetHeader state={resolvedDialogState} />;
      content = (
        <AssetContent
          handleHoldingClick={handleHoldingClick}
          handleAccountClick={handleAccountClick}
        />
      );
    }
  }

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "calc(100% - 120px)",
          width: "640px",
          height: "80%",
        },
      }}
      maxWidth="xs"
      open={state.open}
      onClose={handleCancel}
    >
      <DialogTitle sx={{ display: "flex", flexDirection: "row" }}>
        {header}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {content}
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}
