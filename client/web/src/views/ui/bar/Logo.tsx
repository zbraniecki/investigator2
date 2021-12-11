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
          marginLeft: "10px",
          marginRight: "10px",
          bgcolor: colors.background,
          border: "1px solid",
          borderColor: colors.primary,
        }}
        variant="rounded"
      >
        <SsidChartIcon
          fontSize="large"
          sx={{
            color: colors.primary,
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
          lineHeight: 1.6,
        }}
      >
        Istare Alma
      </Typography>
    </>
  );
}
