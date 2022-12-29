import React from "react";
import { useSelector } from "react-redux";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {
  SettingsDialogTitle,
  SettingsDialogContent,
  SettingsDialogActions,
} from "./pages/Settings";
import {
  AssetDialogTitle,
  AssetDialogContent,
  AssetDialogActions,
} from "./pages/Asset";
import {
  HoldingDialogTitle,
  HoldingDialogContent,
  HoldingDialogActions,
} from "./pages/Holding";
import {
  AccountDialogTitle,
  AccountDialogContent,
  AccountDialogActions,
} from "./pages/Account";
import {
  getAssets,
  getTags,
  getHoldings,
  getAccounts,
  getServices,
} from "../../../../store";
import { Holding } from "../../../../types";
import { assert } from "../../../../utils/helpers";

export enum DialogType {
  None,
  Settings,
  Asset,
  Holding,
  Account,
}

export interface DialogState {
  type?: DialogType;
  meta?: Record<string, string>;
}

interface ResolvedDialogState {
  type: DialogType;
  meta?: Record<string, string>;
}

function resolveDialogState(state: DialogState): ResolvedDialogState {
  return {
    type: state.type ?? DialogType.None,
    meta: state.meta,
  };
}

export function mergeDialogState(
  currentState: DialogState,
  state: DialogState
): DialogState {
  return {
    type: state.type ?? currentState.type,
    meta: state.meta ?? currentState.meta,
  };
}

interface Props {
  state: DialogState;
  updateState: any;
}

export function ModalDialog({ state, updateState }: Props) {
  const assets = useSelector(getAssets);
  const tags = useSelector(getTags);
  const holdings = useSelector(getHoldings);
  const accounts = useSelector(getAccounts);
  const services = useSelector(getServices);

  const handleCloseModal = () => {
    updateState({
      type: DialogType.None,
    });
  };

  const resolvedState = resolveDialogState(state);

  let title;
  let content;
  let actions;
  switch (resolvedState.type) {
    case DialogType.Settings: {
      title = <SettingsDialogTitle />;
      content = <SettingsDialogContent />;
      actions = <SettingsDialogActions handleCloseModal={handleCloseModal} />;
      break;
    }
    case DialogType.Asset: {
      const aid = state.meta?.asset;
      assert(aid);
      const asset = assets[aid];
      const assetTags = [...asset.tags].map((tid: string) => tags[tid]);
      const assetHoldings = Object.values<Holding>(holdings).filter(
        (holding: Holding) => holding.asset === asset.pk
      );
      title = <AssetDialogTitle asset={asset} onClose={handleCloseModal} />;
      content = (
        <AssetDialogContent
          asset={asset}
          tags={assetTags}
          holdings={assetHoldings}
          accounts={accounts}
          services={services}
          updateState={updateState}
        />
      );
      // actions = <AssetDialogActions handleCloseModal={handleCloseModal} />;
      break;
    }
    case DialogType.Holding: {
      const hid = state.meta?.holding;
      assert(hid);
      const holding = holdings[hid];
      const asset = assets[holding.asset];
      const account = accounts[holding.account];
      const assetTags = [...asset.tags].map((tid: string) => tags[tid]);
      const assetHoldings = Object.values<Holding>(holdings).filter(
        (holding: Holding) => holding.asset === asset.pk
      );
      title = (
        <HoldingDialogTitle
          account={account}
          asset={asset}
          holding={holding}
          onClose={handleCloseModal}
          updateState={updateState}
        />
      );
      content = (
        <HoldingDialogContent
          holding={holding}
          tags={assetTags}
          assets={assets}
          holdings={assetHoldings}
          accounts={accounts}
          services={services}
        />
      );
      break;
    }
    case DialogType.Account: {
      const aid = state.meta?.account;
      assert(aid);
      const account = accounts[aid];
      title = (
        <AccountDialogTitle account={account} onClose={handleCloseModal} />
      );
      content = (
        <AccountDialogContent
          account={account}
          assets={assets}
          holdings={holdings}
          services={services}
        />
      );
      break;
    }
  }

  const dialogContent = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    dialogContent.current?.scrollTo(0, 0);
  });

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "80%",
          width: "800px",
          minWidth: "640px",
          maxHeight: "80%",
        },
      }}
      open={resolvedState.type !== DialogType.None}
      onClose={handleCloseModal}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers ref={dialogContent}>
        {content}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
