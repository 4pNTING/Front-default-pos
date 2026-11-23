"use client";

import Grid from "@mui/material/Grid";
import { KdsProps } from "../type/kdsType";
import KdsList from "./kdsList";

const PageRender = ({ props }: { props: KdsProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <KdsList props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
