'use client';

import Grid from '@mui/material/Grid';
import { HomeListProps } from './type/homeType';
import HomeList from './list';

const PageRender = ({ props }: { props: HomeListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <HomeList props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
