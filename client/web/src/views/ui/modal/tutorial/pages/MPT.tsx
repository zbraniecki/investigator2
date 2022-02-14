import Typography from "@mui/material/Typography";

export function MPTPage() {
  return (
    <>
      <Typography>
        The second strategy is <strong>Modern Portfolio Theory</strong>.
      </Typography>
      <Typography>
        This strategy is also designed to help with lack of information. Without
        time to continously accumulate knowledge about markets it is impossible
        to know which assets to invest in at a given moment.
      </Typography>
      <Typography>
        What&apos;s worse, you do accumulate <i>some</i> selective information
        from media. An asset goes up by 1000% and everyone talks about it. This
        triggers an emotion of <strong>Fear Of Missing Out</strong> and pushes
        you to <strong>follow</strong> the trend and buy at the highest price
        point.
      </Typography>
      <Typography>
        To counter that, <i>MPT</i> focuses on building targets for each asset
        or class (say <i>&quot;10% in Tech Stock and 10% in Crypto&quot;</i>).
        When an asset goes <strong>down</strong> it shows as below your target
        and you can buy it.
      </Typography>
      <Typography>
        In result you continously <strong>rebalancing</strong> your portfolio
        buying what is cheapest now. Assuming your selected your targets
        decently, this strategy works almost as well as much more sophisticated
        ones, with little investment of time required.
      </Typography>
    </>
  );
}
