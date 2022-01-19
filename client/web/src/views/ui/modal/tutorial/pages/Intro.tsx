import Typography from "@mui/material/Typography";

export function IntroPage() {
  return (
    <>
      <Typography sx={{ p: 1 }}>
        Welcome to Istare Alma, a companion app for <strong>investment</strong>{" "}
        driven <strong>wealth accumulation</strong>.
      </Typography>
      <Typography sx={{ p: 1 }}>
        The app <strong>simplifies</strong> a complex process, but to use it, it
        is useful to understand several basic concepts such as{" "}
        <i>investement</i>, <i>DCA</i>, and <i>MPT</i>.
      </Typography>
      <Typography sx={{ p: 1 }}>
        If you're familiar with the concepts, feel free to jump to Step 2 - "Add
        Holdings".
      </Typography>
    </>
  );
}
