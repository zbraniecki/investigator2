import Typography from "@mui/material/Typography";

export function StrategyPage() {
  return (
    <>
      <Typography>
        Once you designed your risk profile, you will want to build a{" "}
        <strong>strategy</strong> that will use to invest your income.
      </Typography>
      <Typography>
        If you could <strong>see the future</strong>, you wouldn't need risk
        profile - you would know what assets will increase in value and provide
        passive income! In the absence of this skill, if you had infinite amount
        of <strong>time</strong>, you could accumulate all knowledge and use it
        to optimally time when the asset is cheap, and buy it then.
      </Typography>
      <Typography>
        This app is designed to follow a combination of two investment
        strategies - <i>Daily Cost Average</i> and{" "}
        <i>Modern Portfolio Theory</i>. Those strategies are meant to minimize
        the cost of not seeing the future, and not having all the knowledge.
      </Typography>
      <Typography>
        They are not the most aggressive, or the most sophisticated, but they
        are a good choice for when you have limited time and knowledge, and are
        okay with smaller returns at a lower risk.
      </Typography>
    </>
  );
}
