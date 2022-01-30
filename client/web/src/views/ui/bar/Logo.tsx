import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import { AppBarColors } from "../AppBar";

interface Props {
  colors: AppBarColors;
}

export function Logo({ colors }: Props) {
  return (
    <>
      <Avatar
        sx={{
          marginLeft: "max(1vh, 0.2em)",
          marginRight: "max(1vh, 0.2em)",
          bgcolor: colors.background,
          border: "1px solid",
          borderColor: colors.primary,
          height: "max(6vh, 2em)",
          width: "calc(max(6vh, 2em) - 0.2em)",
        }}
        variant="rounded"
      >
        <SsidChartIcon
          sx={{
            color: colors.primary,
            fontSize: "max(5.4vh, 1.8em)",
          }}
        />
      </Avatar>
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          color: colors.primary,
          borderBottom: "1px solid",
          borderColor: colors.primary,
          fontSize: "max(2.6vh, 1.2em)",
          "@media (max-width: 20em)": {
            display: "none",
          },
        }}
      >
        Istare Alma
      </Typography>
    </>
  );
}
