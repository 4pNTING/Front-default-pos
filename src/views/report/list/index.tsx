"use client";

import Grid from "@mui/material/Grid";
import { ReportListProps } from "../type/reportType";
import { ReportList } from "./reportList";

const PageRender = ({ props }: { props: ReportListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReportList props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
