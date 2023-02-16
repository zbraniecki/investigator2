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
  WatchlistDialogTitle,
  WatchlistDialogContent,
  WatchlistDialogActions,
} from "./pages/Watchlist";
import {
  getAssets,
  getTags,
  getHoldings,
  getAccounts,
  getServices,
  getPublicWatchlists,
  getUserWatchlists,
  getSession,
  getUsers,
  getPortfolios,
} from "../../../../store";
import { Tag, Holding, Watchlist } from "../../../../types";
import { assert } from "../../../../utils/helpers";

export enum DialogType {
  None,
  Settings,
  Asset,
  Holding,
  Account,
  Watchlist,
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

function getHoldingFromState(
  state: DialogState,
  holdings: Record<string, Holding>
): Partial<Holding> {
  if (state.meta?.holding) {
    return holdings[state.meta?.holding];
  }
  return {};
}

export function ModalDialog({ state, updateState }: Props) {
  const holdings = useSelector(getHoldings);

  const [holding, setHolding] = React.useState(
    getHoldingFromState(state, holdings)
  );
  const [watchlist, setWatchlist] = React.useState({} as Partial<Watchlist>);

  React.useEffect(() => {
    setWatchlist({});
    setHolding(getHoldingFromState(state, holdings));
  }, [state]);

  const assets = useSelector(getAssets);
  const tags = useSelector(getTags);
  const accounts = useSelector(getAccounts);
  const services = useSelector(getServices);
  const publicWatchlists = useSelector(getPublicWatchlists);
  const userWatchlists = useSelector(getUserWatchlists);
  const session = useSelector(getSession);
  const users = useSelector(getUsers);
  const portfolios = useSelector(getPortfolios);

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
      const assetTags: Array<Tag> = [tags[asset.asset_class]];
      assetTags.push(...[...asset.tags].map((tid: string) => tags[tid]));
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
      const asset = holding?.asset && assets[holding.asset];
      const account = holding?.account && accounts[holding.account];
      const assetTags =
        asset && [...asset.tags].map((tid: string) => tags[tid]);
      const assetHoldings =
        asset &&
        Object.values<Holding>(holdings).filter(
          (holding: Holding) => holding.asset === asset.pk
        );
      title = (
        <HoldingDialogTitle
          assets={assets}
          accounts={accounts}
          account={account}
          holding={holding}
          setHolding={setHolding}
          asset={asset}
          onClose={handleCloseModal}
          updateState={updateState}
        />
      );
      content = (
        <HoldingDialogContent
          holding={holding}
          setHolding={setHolding}
          tags={assetTags}
          assets={assets}
          holdings={assetHoldings}
          accounts={accounts}
          services={services}
        />
      );
      actions = (
        <HoldingDialogActions
          handleCloseModal={handleCloseModal}
          holding={holding}
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
    case DialogType.Watchlist: {
      // for (let p in account.
      // function getWatchlist(
      //   pw: Watchlist[],
      //   uw: Watchlist[],
      //   wid: string
      // ): Watchlist | null {
      //   return null;
      // }
      //
      // const wid = state.meta?.watchlist;
      // const watchlist = wid
      //   ? getWatchlist(publicWatchlists, userWatchlists, wid)
      //   : null;
      title = (
        <WatchlistDialogTitle
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          onClose={handleCloseModal}
        />
      );
      content = (
        <WatchlistDialogContent
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          publicWatchlists={publicWatchlists}
          userWatchlists={userWatchlists}
          portfolios={portfolios}
        />
      );
      actions = (
        <WatchlistDialogActions
          handleCloseModal={handleCloseModal}
          watchlist={watchlist}
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
