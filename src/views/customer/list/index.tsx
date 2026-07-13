'use client';

import Grid from '@mui/material/Grid';
import { CustomerListProps } from '../type/customerType';
import { List } from '../list/customerList';

const PageRender = ({ props }: { props: CustomerListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <List props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;