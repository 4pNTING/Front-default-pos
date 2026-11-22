"use client";

import Grid from "@mui/material/Grid";
import { InventoryListProps } from "../type/inventoryType";
import { InventoryList } from "./inventoryList";

const PageRender = ({ props }: { props: InventoryListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <InventoryList props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
