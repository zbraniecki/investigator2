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
import { getSession, getUsers } from "../../../store/account";
import {
  getAssetInfo,
  getTaxonomies,
  Category,
  Tag,
  AssetInfo,
} from "../../../store/oracle";
import { assert } from "../../../utils/helpers";

interface Props {
  open: boolean;
  setOpen: any;
}

export function HoldingDialog({ open, setOpen }: Props) {
  const [assetClass, setAssetClass] = React.useState(
    undefined as string | undefined
  );
  const [asset, setAsset] = React.useState(undefined as string | undefined);

  const session = useSelector(getSession);
  const users = useSelector(getUsers);
  const assetInfo = useSelector(getAssetInfo);
  const taxonomies = useSelector(getTaxonomies);

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
    if (assetClass === undefined) {
      setAssetClass(defaultTag.pk);
    }
  }

  if (assetClass !== undefined && assetInfo !== undefined) {
    assets = Object.values(assetInfo).filter(
      (asset: AssetInfo) => asset.asset_class === assetClass
    ) as AssetInfo[];

    if (assets.length > 0 && asset === undefined) {
      const defaultAsset = assets[0];
      assert(defaultAsset);
      setAsset(defaultAsset.pk);
    }
  }

  const currentUser = users[session.user_pk];

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleAssetClassChange = (event: any) => {
    setAssetClass(event.target.value);
    setAsset(undefined);
  };

  const handleAssetChange = (event: any) => {
    const { value } = event.target;
    console.log(value);
    setAsset(value);
    // dispatch(
    //   updateUserInfoThunk({
    //     token: session.token,
    //     pk: session.user_pk,
    //     baseAsset: value,
    //   })
    // );
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
    >
      <DialogTitle>Add Holding</DialogTitle>
      <DialogContent dividers>
        <Box>
          <FormControl variant="standard">
            <InputLabel id="holding-asset-class-label">Class</InputLabel>
            <Select
              labelId="holding-asset-class-label"
              id="holding-asset-class"
              value={assetClass}
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
              value={asset}
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
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            id="outlined-number"
            label="Quantity"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
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
