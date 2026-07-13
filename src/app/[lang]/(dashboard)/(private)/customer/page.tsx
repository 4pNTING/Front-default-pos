import PageRender from "@views/customer/list/index";
import { Locale } from "@/configs/i18n";
import { getDictionary } from "@/utils/getDictionary";
import Grid from "@mui/material/Grid";

const CustomerPage = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params.lang);
  return (

    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageRender props={{ dictionary: dictionary, lang: params.lang }} />
      </Grid>
    </Grid>

  );
};

export default CustomerPage;
