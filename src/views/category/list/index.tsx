"use client";

import Grid from "@mui/material/Grid";
import { CategoryListProps } from "../type/categoryType";
import { List } from "./categoryList";

const PageRender = ({ props }: { props: CategoryListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <List props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
