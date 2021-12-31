import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { orange } from "@mui/material/colors";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { AssetContent, AssetHeader } from "./holding/Asset";
import { HoldingContent, HoldingHeader } from "./holding/Holding";
import { AccountContent, AccountHeader } from "./holding/Account";
import {
  getSession,
  getUsers,
  getAccounts,
  createHoldingThunk,
  Account,
  Holding,
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

export enum HoldingDialogTab {
  Asset = 0,
  Holding = 1,
  Account = 2,
}

export interface DialogState {
  open: boolean;
  selectedTab?: HoldingDialogTab;
  holdingPk?: string;
}

interface Props {
  state: DialogState;
  setCloseDialog: any;
  updateHoldingState: any;
}

export function HoldingDialog({ state, updateHoldingState }: Props) {
  const dispatch = useDispatch();

  const session = useSelector(getSession);
  const users = useSelector(getUsers);
  const assetInfo = useSelector(getAssetInfo);
  const taxonomies = useSelector(getTaxonomies);
  const accounts = useSelector(getAccounts);

  const [assetClassPk, setAssetClassPk] = React.useState(
    undefined as string | undefined
  );
  const [assetPk, setAssetPk] = React.useState(undefined as string | undefined);
  const [accountPk, setAccountPk] = React.useState(
    undefined as string | undefined
  );
  const [quantity, setQuantity] = React.useState(
    undefined as number | undefined
  );

  let currentHolding;
  let currentAccount;

  for (const account of Object.values<Account>(accounts)) {
    for (const h of account.holdings) {
      if (h.pk === state.holdingPk) {
        currentHolding = h;
        currentAccount = account;
        break;
      }
    }
  }

  if (currentAccount && accountPk === undefined) {
    setAccountPk(currentAccount.pk);
  }

  if (currentHolding && assetPk === undefined) {
    const asset = assetInfo[currentHolding.asset];
    setAssetClassPk(asset.asset_class);
    setAssetPk(asset.pk);
    setQuantity(currentHolding.quantity);
  }

  const assetClassCategory = Object.values(taxonomies.categories).find(
    (category: Category) => category.name == "asset_class"
  ) as Category;
  let tags: Tag[] = [];
  let assets: AssetInfo[] = [];
  const defaultTagSlug = "fiat";

  if (assetClassCategory) {
    tags = ["fiat", "crypto"].map((slug) => {
      const result = Object.values(taxonomies.tags).find(
        (tag: Tag) => tag.slug === slug
      );
      assert(result);
      return result;
    }) as Tag[];
    const defaultTag = tags.find((tag) => tag.slug === "fiat");
    assert(defaultTag);
    if (assetClassPk === undefined) {
      setAssetClassPk(defaultTag.pk);
    }
  }

  if (assetClassPk !== undefined && assetInfo !== undefined) {
    assets = Object.values(assetInfo).filter(
      (asset: AssetInfo) => asset.asset_class === assetClassPk
    ) as AssetInfo[];
  }

  const currentUser = users[session.user_pk];
  const asset = assetPk ? assetInfo[assetPk] : undefined;
  const account = accountPk ? accounts[accountPk] : undefined;

  const handleCancel = () => {
    updateHoldingState(false);
  };

  const handleOk = () => {
    if (quantity === undefined) {
      return false;
    }
    if (asset === undefined) {
      return false;
    }
    if (account === undefined) {
      return false;
    }

    const p = dispatch(
      createHoldingThunk({
        token: session.token,
        assetPk: asset.pk,
        accountPk: account.pk,
        ownerPk: currentUser.pk,
        quantity,
      })
    ) as unknown as Promise<any>;
    p.then((resp: any) => {
      if (resp.payload.pk) {
        setAssetPk(undefined);
        setAccountPk(undefined);
        updateHoldingState(false);
      }
    });
  };

  const handleAssetClassChange = (event: any) => {
    setAssetClassPk(event.target.value);
    setAssetPk(undefined);
  };

  const handleQuantityChange = (event: any) => {
    setQuantity(event.target.value);
  };

  const handleAssetChange = (event: any) => {
    const { value } = event.target;
    setAssetPk(value);
  };

  const handleServiceChange = (event: any) => {
    setAccountPk(event.target.value);
  };

  const data = [
    // {
    //   label: "Price", value: {
    //     current: 44301,
    //     range: {
    //       low: 43201,
    //       high: 45921,
    //     },
    //     change: {
    //       "1h": 0.1,
    //       "24h": 0.1,
    //       "7d": 0.1,
    //       "30d": 0.1,
    //     }
    //   },
    // },
    // {
    //   label: "Market Cap", value: {
    //     current: 321231,
    //     change: {
    //       "24h": 0.2,
    //     },
    //   },
    // },
    // {
    //   label: "Supply",
    //   value: {
    //     circulating: 10,
    //     total: 10,
    //     max: 10,
    //   },
    // },
    // { label: "Inflation", value: 10 },
    // { label: "Last Updated", value: 0.1 },
    // { label: "Owned Value", value: [25400] },
    // {
    //   label: "Holdings", value: [
    //     {
    //       account: "Hodlnout",
    //       value: 0.1,
    //       apy: 0.072,
    //     },
    //     {
    //       account: "BlockFi",
    //       value: 0.02,
    //       apy: 0.062,
    //     },
    //     {
    //       account: "Celsius",
    //       apy: 0.062,
    //     }
    //   ],
    // },
  ];

  const handleHoldingClick = (event: any) => {
    updateHoldingState(undefined, HoldingDialogTab.Holding);
  };

  const handleAccountClick = (event: any) => {
    updateHoldingState(undefined, HoldingDialogTab.Account);
  };

  let content;
  let header;
  switch (state.selectedTab) {
    case HoldingDialogTab.Holding: {
      header = <HoldingHeader asset={asset} account={currentAccount} />;
      content = <HoldingContent />;
      break;
    }
    case HoldingDialogTab.Account: {
      header = <AccountHeader />;
      content = <AccountContent />;
      break;
    }
    case HoldingDialogTab.Asset:
    default: {
      header = <AssetHeader asset={asset} />;
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
        {/* <Box>
          <FormControl variant="standard">
            <InputLabel id="holding-asset-class-label">Class</InputLabel>
            <Select
              labelId="holding-asset-class-label"
              id="holding-asset-class"
              value={assetClassPk || ""}
              onChange={handleAssetClassChange}
              label="Class"
            >
              {tags.map((tag) => (
                <MenuItem
                  key={`holding-asset-class-item-${tag.pk}`}
                  value={tag.pk}
                >
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="holding-asset-label">Asset</InputLabel>
            <Select
              labelId="holding-asset-label"
              id="holding-asset"
              value={asset ? asset.pk : ""}
              onChange={handleAssetChange}
              label="Asset"
            >
              {assets.map((asset) => (
                <MenuItem
                  key={`holding-asset-item-${asset.pk}`}
                  value={asset.pk}
                >
                  {asset.name}
                </MenuItem>
              ))}
              ;
            </Select>
          </FormControl>
          <TextField
            id="outlined-number"
            label="Quantity"
            type="number"
            value={quantity || ""}
            onChange={handleQuantityChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box>
          <FormControl variant="standard">
            <InputLabel id="holding-asset-label">Account</InputLabel>
            <Select
              labelId="holding-asset-label"
              id="holding-asset"
              value={account?.pk || ""}
              onChange={handleServiceChange}
              label="Account"
            >
              {Object.values(accounts).map((account: any) => (
                <MenuItem
                  key={`holding-accounts-item-${account.pk}`}
                  value={account.pk}
                >
                  {account.name}
                </MenuItem>
              ))}
              ;
            </Select>
          </FormControl>
        </Box> */}
      </DialogContent>
      <BottomNavigation
        showLabels
        value={state.selectedTab}
        onChange={(event, newValue) => {
          updateHoldingState(undefined, newValue);
        }}
      >
        <BottomNavigationAction label="Asset" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Holding" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Account" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Dialog>
  );
}
