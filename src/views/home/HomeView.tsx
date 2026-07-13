'use client';

import Grid from '@mui/material/Grid';
import { getDictionary } from '@/utils/getDictionary';

export type HomeViewProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

const HomeView = ({ props }: { props: HomeViewProps }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex flex-col gap-[15px]'>
          <h1>Home</h1>
        </div>
      </Grid>
    </Grid>
  );
};

export default HomeView;
