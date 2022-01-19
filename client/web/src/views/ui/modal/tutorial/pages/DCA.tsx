import Typography from "@mui/material/Typography";

export function DCAPage() {
  return (
    <>
      <Typography>
        First strategy is called <strong>Daily Cost Average</strong>.
      </Typography>
      <Typography>
        Every asset that we want to invest in carries{" "}
        <strong>volitility</strong>. If it can raise in value, it can also drop
        in value.
      </Typography>
      <Typography>
        Without a lot of information, it is tricky to select{" "}
        <strong>when</strong> is the right time to buy it. You can buy it today
        for $40, and tomorrow the price can drop to $20, or raise to $60. How to
        chose the right <strong>entry point</strong>?
      </Typography>
      <Typography>
        To reduce the risk, this strategy suggests spreading the buys over time.
        Buy 1/4th of your monthly investment each week, and you minimize the
        risk of buying at the wrong times.
      </Typography>
      <Typography>
        This strategy reduces the <strong>voilatility</strong>. You pay for lack
        of deep knowledge, with reduced potential for large gains, but lower
        your risk as well.
      </Typography>
    </>
  );
}
