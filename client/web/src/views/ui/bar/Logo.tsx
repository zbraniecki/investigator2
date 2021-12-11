import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import { AppBarColors } from "../AppBar";

interface Props {
  lightModeName: string;
  colors: AppBarColors;
}

export function Logo({ lightModeName, colors }: Props) {
  const logoColors = {
    bg: colors.background,
    lines: colors.primary,
    text: colors.primary,
  };

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
