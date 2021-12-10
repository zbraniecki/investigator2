import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SsidChartIcon from "@mui/icons-material/SsidChart";

interface Props {
  lightModeName: string;
}

export function Logo({ lightModeName }: Props) {
  let logoColors = {
    bg: "background.paper",
    lines: "divider",
    text: "black",
  }

  if (lightModeName === "light") {
    logoColors = {
      bg: "primary.50",
      lines: "primary.600",
      text: "primary.50",
    }
  }

  return (
    <>
      <Avatar
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          bgcolor: logoColors.bg,
        }}
        variant="rounded"
      >
        <SsidChartIcon fontSize="large" sx={{
          color: logoColors.lines,
        }} />
      </Avatar>
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          color: logoColors.text,
          borderBottom: "1px solid",
          borderColor: logoColors.text,
          lineHeight: 1.6,
        }}
      >
        Istare Alma
      </Typography>
    </>
  );
}