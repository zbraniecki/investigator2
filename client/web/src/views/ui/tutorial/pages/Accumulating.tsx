import Typography from "@mui/material/Typography";

export function AccumulatingPage() {
  return (
    <>
      <Typography>
        The idea behind <strong>wealth accumulation</strong> is that you set
        aside <strong>income</strong> over time to build into{" "}
        <strong>wealth</strong>.
      </Typography>
      <Typography>
        The value doesn't matter - $10, $1000, or $10,000. The intervals don't
        matter either - weekly, monthly, quarterly - what matters is that you
        can set aside some money at some interval.
      </Typography>
      <Typography>
        In the simplest model, you could just put that money aside at each
        interval. For example, if you were to set aside $10 once per month for 5
        years, you would accumulate 10 * 12 * 5 = $600.
      </Typography>
      <Typography>
        There are two issues with that strategy. First, your money sits idely,
        missing an opportunity to accumulate, but more importantly, most assets{" "}
        <strong>inflate</strong>. If you store your wealth in an inflating
        asset, it actually slowly lose value just by holding it.
      </Typography>
    </>
  );
}
