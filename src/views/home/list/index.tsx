'use client';

import Grid from '@mui/material/Grid';
import { HomeListProps } from '../type/homeType';
import { List } from '../list/homeList';

const PageRender = ({ props }: { props: HomeListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <List props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
