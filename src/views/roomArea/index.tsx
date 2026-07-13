'use client';

import Grid from '@mui/material/Grid';
import { RoomAreaListProps } from './type/roomAreaType';
import RoomAreaList from './list';

const PageRender = ({ props }: { props: RoomAreaListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RoomAreaList props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;