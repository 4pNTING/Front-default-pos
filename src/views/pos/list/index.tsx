"use client";

import Grid from "@mui/material/Grid";
import { POSListProps } from "../type/posType";
import { POSList } from "./posList";

const PageRender = ({ props }: { props: POSListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <POSList props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
