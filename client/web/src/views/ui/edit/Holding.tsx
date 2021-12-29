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
import {
  getSession,
  getUsers,
  getAccounts,
  createHoldingThunk,
  Account,
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

interface Props {
  holdingPk?: string;
  setCloseDialog: any;
}

export function HoldingDialog({ holdingPk, setCloseDialog }: Props) {
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
      if (h.pk === holdingPk) {
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
    setCloseDialog();
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
        setCloseDialog();
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

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", height: "80%" } }}
      maxWidth="xs"
      open={Boolean(holdingPk)}
    >
      <DialogTitle sx={{ display: "flex", flexDirection: "row" }}>
        <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
          {asset?.symbol[0].toUpperCase()}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography>{asset?.symbol.toUpperCase()}</Typography>
          <Typography>{asset?.name}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          <FormControl variant="standard">
            <InputLabel id="holding-asset-class-label">Class</InputLabel>
            <Select
              labelId="holding-asset-class-label"
              id="holding-asset-class"
              value={assetClassPk}
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
              value={asset?.pk || ""}
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
            value={quantity}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
