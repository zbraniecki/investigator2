import React from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { orange } from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import {
  Asset,
  Tag,
  Account,
  Holding,
  Service,
  TransactionType,
  getTransactionTypeLabel,
} from "../../../../../types";
import { assert , tryParseNumber } from "../../../../../utils/helpers";
import { currency, percent, datetime , number } from "../../../../../utils/formatters";
import {
  useAppDispatch,
  getSession,
  addHoldingThunk,
  createTransactionThunk,
} from "../../../../../store";
import { DialogType } from "../Dialog";

interface TitleProps {
  assets: Record<string, Asset>;
  accounts: Record<string, Account>;
  account?: Account;
  holding: Partial<Holding>;
  setHolding: any;
  asset?: Asset;
  onClose: any;
  updateState: any;
}

export function HoldingDialogTitle({
  assets,
  accounts,
  account,
  holding,
  setHolding,
  asset,
  onClose,
  updateState,
}: TitleProps) {
  const handleSetAsset = (event: SelectChangeEvent) => {
    const newHolding = Object.fromEntries(Object.entries(holding));
    newHolding.asset = event.target.value as string;
    setHolding(newHolding);
  };

  const handleSetAccount = (event: SelectChangeEvent) => {
    const newHolding = Object.fromEntries(Object.entries(holding));
    newHolding.account = event.target.value as string;
    setHolding(newHolding);
  };

  const handleAssetClick = () => {
    assert(asset);
    updateState({
      type: DialogType.Asset,
      meta: {
        asset: asset.pk,
      },
    });
  };
  return (
    <Stack direction="row">
      <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
        {asset?.symbol[0].toUpperCase()}
      </Avatar>
      <Stack>
        {holding.pk ? (
          <Typography>{asset?.symbol.toUpperCase()}</Typography>
        ) : (
          <Select
            size="small"
            value={holding.asset || ""}
            onChange={handleSetAsset}
          >
            {Object.values(assets).map((asset) => (
              <MenuItem key={`add-holding-asset-${asset.pk}`} value={asset.pk}>
                {asset.symbol.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        )}
        <Typography>
          <Link href="#" onClick={handleAssetClick}>
            {asset?.name}
          </Link>
        </Typography>
      </Stack>
      <Stack>
        {holding.pk ? (
          <Typography>{account?.name}</Typography>
        ) : (
          <Select
            size="small"
            value={holding.account || ""}
            sx={{ width: 220 }}
            onChange={handleSetAccount}
          >
            {Object.values(accounts).map((account) => (
              <MenuItem
                key={`add-holding-account-${account.pk}`}
                value={account.pk}
              >
                {account.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </Stack>
      <Box sx={{ flex: 1 }} />
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

interface ContentProps {
  holding: Partial<Holding>;
  setHolding: any;
  tags?: Array<Tag>;
  assets?: Record<string, Asset>;
  holdings?: Array<Holding>;
  accounts: Record<string, Account>;
  services: Record<string, Service>;
}

export function HoldingDialogContent({
  holding,
  setHolding,
  tags,
  assets,
  holdings,
  accounts,
  services,
}: ContentProps) {
  const [tempQuantity, setTempQuantity] = React.useState("0.0");

  const asset = holding?.asset && assets && assets[holding.asset];
  const account = holding?.account && accounts[holding.account];

  const handleSetQuantity = (event: any) => {
    const result = tryParseNumber(event.target.value);
    if (result !== undefined) {
      let v = event.target.value;
      if (v.startsWith(".")) {
        v = `0${v}`;
      }
      setTempQuantity(v);
    }
  };

  function handleQuantityFocus() {
    if (tempQuantity === "0.0") {
      setTempQuantity("");
    }
  }

  function handleQuantityBlur() {
    const result = tryParseNumber(tempQuantity);
    if (result === undefined) {
      setTempQuantity("0.0");
      return;
    }
    setTempQuantity(number(result));

    const newHolding = Object.fromEntries(Object.entries(holding));
    newHolding.quantity = result;
    setHolding(newHolding);
  }

  const transactions =
    asset &&
    account &&
    account.transactions
      .filter(
        (transaction) =>
          transaction.asset === asset.pk &&
          (transaction.holding === null || transaction.holding === holding.pk)
      )
      .map((transaction) => ({
        pk: transaction.pk,
        timestamp: transaction.timestamp,
        type: transaction.type,
        quantity: transaction.quantity,
        value: asset.info.value * transaction.quantity,
        source: null,
      }))
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

  return (
    <Stack>
      {holding.asset && (
        <>
          <Stack direction="row">
            <Stack sx={{ flex: 3 }}>
              {holding.pk ? (
                <Typography
                  variant="h4"
                  sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  {number(holding?.quantity)}
                </Typography>
              ) : (
                <InputBase
                  sx={{
                    fontSize: "2.125rem",
                    marginTop: "10px",
                    marginBottom: "10px",
                    textAlign: "center",
                    "& input": {
                      padding: 0,
                      textAlign: "center",
                    },
                  }}
                  onChange={handleSetQuantity}
                  onFocus={handleQuantityFocus}
                  onBlur={handleQuantityBlur}
                  value={tempQuantity}
                />
              )}
              <Stack
                direction="row"
                sx={{
                  width: "100%",
                  padding: "0 20px",
                  justifyContent: "space-between",
                }}
              >
                {[
                  {
                    label: "1h",
                    value:
                      asset && percent(asset.info.price_change_percentage_1h),
                  },
                  {
                    label: "24h",
                    value:
                      asset && percent(asset.info.price_change_percentage_24h),
                  },
                  {
                    label: "7d",
                    value:
                      asset && percent(asset.info.price_change_percentage_7d),
                  },
                  {
                    label: "30d",
                    value:
                      asset && percent(asset.info.price_change_percentage_30d),
                  },
                ].map((chip) => (
                  <Chip
                    key={chip.label}
                    label={
                      <>
                        <Box component="span" sx={{ color: "#666666" }}>
                          {chip.label}:
                        </Box>{" "}
                        {chip.value}
                      </>
                    }
                    sx={{ color: "#999999" }}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Stack>
            <Table sx={{ flex: 2, marginRight: "10px" }}>
              <TableBody
                sx={{
                  "& td": { p: 0 },
                  "& tr:last-of-type td": { border: "0" },
                  "& td:last-of-type": { textAlign: "right", color: "#999999" },
                  "& td:first-of-type": { color: "#999999" },
                }}
              >
                <TableRow>
                  <TableCell>Value</TableCell>
                  <TableCell>$15,212</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cost basis</TableCell>
                  <TableCell>$12,121</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cost basis / BTC</TableCell>
                  <TableCell>$47,121</TableCell>
                </TableRow>
                {/* <TableRow>
              <TableCell>Net deposits</TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Net proceeds</TableCell>
              <TableCell>
              </TableCell>
            </TableRow> */}
                <TableRow>
                  <TableCell>Total return</TableCell>
                  <TableCell>$1,431</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
          <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
          <Stack direction="row">
            <Table sx={{ flex: 1.5, marginRight: "10px" }}>
              <TableBody
                sx={{
                  "& td": { p: 0 },
                  "& tr:last-of-type td": { border: "0" },
                  "& td:last-of-type": { textAlign: "right", color: "#999999" },
                  "& td:first-of-type": { color: "#999999" },
                }}
              >
                <TableRow>
                  <TableCell>Payout Frequency</TableCell>
                  <TableCell>1 day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Range (0.0 - 1.0)</TableCell>
                  <TableCell>6.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interest Asset</TableCell>
                  <TableCell>VTHO</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Locked period</TableCell>
                  <TableCell>28 days</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Stack sx={{ flex: 2, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{ marginTop: "10px" }}
                color="#999999"
              >
                APY: 6.2%
              </Typography>
              <Typography color="#666666">Liquid Staking</Typography>
            </Stack>
            <Table sx={{ flex: 1.5, marginRight: "10px" }}>
              <TableBody
                sx={{
                  "& td": { p: 0 },
                  "& tr:last-of-type td": { border: "0" },
                  "& td:last-of-type": { textAlign: "right", color: "#999999" },
                  "& td:first-of-type": { color: "#999999" },
                }}
              >
                <TableRow>
                  <TableCell>01/2022</TableCell>
                  <TableCell>6.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>12/2021</TableCell>
                  <TableCell>6.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>11/2021</TableCell>
                  <TableCell>6.2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>10/2021</TableCell>
                  <TableCell>6.2%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
        </>
      )}
      {holding.pk && (
        <Paper sx={{ marginTop: "20px" }}>
          <Typography
            sx={{ paddingLeft: "15px", paddingTop: "5px", fontSize: "0.9em" }}
          >
            Transactions
          </Typography>
          <Table sx={{ opacity: "0.8" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "30%" }}>Date</TableCell>
                <TableCell sx={{ width: "20%" }}>Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions &&
                transactions.map((transaction) => (
                  <TableRow key={transaction.pk}>
                    <TableCell>{datetime(transaction.timestamp)}</TableCell>
                    <TableCell>
                      {getTransactionTypeLabel(transaction.type)}
                    </TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{currency(transaction.value)}</TableCell>
                    <TableCell>{transaction.source}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
}

interface ActionProps {
  handleCloseModal: any;
  holding: Partial<Holding>;
}

export function HoldingDialogActions({
  handleCloseModal,
  holding,
}: ActionProps) {
  const dispatch = useAppDispatch();
  const session = useSelector(getSession);

  const handleCancel = () => {
    handleCloseModal();
  };

  const handleOk = () => {
    const result = Object.fromEntries(Object.entries(holding));
    result.owner = session.user_pk;
    dispatch(
      addHoldingThunk({
        token: session.token,
        holding: result,
      })
    ).unwrap()
      .then((holding) => {
        assert(holding.account);
        dispatch(createTransactionThunk({
          token: session.token,
          input: {
            account: holding.account,
            holding: holding.pk,
            asset: holding.asset,
            type: TransactionType.Buy,
            quantity: holding.quantity,
            timestamp: new Date(),
          },
        })).unwrap()
        .then(() => {
          handleCloseModal();
        });
    });
  };

  return (
    <>
      <Button autoFocus onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleOk}>Ok</Button>
    </>
  );
}
