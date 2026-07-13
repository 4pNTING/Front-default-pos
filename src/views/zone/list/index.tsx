'use client';

import Grid from '@mui/material/Grid';
import { ZoneListProps } from '../type/zoneType';
import { List } from './zoneList';

const PageRender = ({ props }: { props: ZoneListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <List props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;