'use client';

import Grid from '@mui/material/Grid';
import { MenuItemListProps } from '../type/menuItemType';
import { MenuItemList } from './menuItemList';

const PageRender = ({ props }: { props: MenuItemListProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MenuItemList props={props} />
      </Grid>
    </Grid>
  );
};

export default PageRender;
