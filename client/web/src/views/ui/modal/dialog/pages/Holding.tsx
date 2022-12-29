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
import {
  Asset,
  Tag,
  Account,
  Holding,
  Service,
  getTransactionTypeLabel,
} from "../../../../../types";
import { assert } from "../../../../../utils/helpers";
import { currency, percent, datetime } from "../../../../../utils/formatters";
import { DialogType } from "../Dialog";

interface TitleProps {
  holding: Holding;
  asset: Asset;
  account: Account;
  onClose: any;
  updateState: any;
}

export function HoldingDialogTitle({
  account,
  holding,
  asset,
  onClose,
  updateState,
}: TitleProps) {
  const handleAssetClick = () => {
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
        {asset.symbol[0].toUpperCase()}
      </Avatar>
      <Stack>
        <Typography>{asset.symbol.toUpperCase()}</Typography>
        <Typography>
          <Link href="#" onClick={handleAssetClick}>{asset.name}</Link>
        </Typography>
      </Stack>
      <Stack>
        <Typography>{account.name}</Typography>
      </Stack>
      <Box sx={{ flex: 1 }} />
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

interface ContentProps {
  holding: Holding;
  tags: Array<Tag>;
  assets: Record<string, Asset>;
  holdings: Array<Holding>;
  accounts: Record<string, Account>;
  services: Record<string, Service>;
}

export function HoldingDialogContent({
  holding,
  tags,
  assets,
  holdings,
  accounts,
  services,
}: ContentProps) {
  assert(holding.account);

  const asset = assets[holding.asset];
  const account = accounts[holding.account];
  console.log(account.transactions);

  const transactions = account.transactions
    .filter((transaction) => transaction.asset === asset.pk && transaction.account == account.pk)
    .map((transaction) => ({
      pk: transaction.pk,
      timestamp: transaction.timestamp,
      type: transaction.type,
      quantity: transaction.quantity,
      value: asset.info.value * transaction.quantity,
      source: null,
    }));
  transactions.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

  return (
    <Stack>
      <Stack direction="row">
        <Stack sx={{ flex: 3 }}>
          <Typography
            variant="h4"
            sx={{
              marginTop: "10px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
	    {holding.quantity}
          </Typography>
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
                value: percent(asset.info.price_change_percentage_1h),
              },
              {
                label: "24h",
                value: percent(asset.info.price_change_percentage_24h),
              },
              {
                label: "7d",
                value: percent(asset.info.price_change_percentage_7d),
              },
              {
                label: "30d",
                value: percent(asset.info.price_change_percentage_30d),
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
          <Typography variant="h6" sx={{ marginTop: "10px" }} color="#999999">
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
            {transactions.map((transaction) => (
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
    </Stack>
  );
}

interface ActionProps {
  handleCloseModal: any;
}

export function HoldingDialogActions({ handleCloseModal }: ActionProps) {
  const handleCancel = () => {
    handleCloseModal();
  };

  const handleOk = () => {};

  return (
    <>
      <Button autoFocus onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleOk}>Ok</Button>
    </>
  );
}
