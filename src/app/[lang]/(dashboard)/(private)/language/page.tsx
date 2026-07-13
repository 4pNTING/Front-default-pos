// MUI
import Grid from '@mui/material/Grid'
// i18n
import { Locale } from '@/configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
// View
import ChangeLanguage from '@/views/language/ChangeLanguage'

const LanguagePage = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params.lang)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ChangeLanguage props={{ lang: params.lang, dictionary }} />
      </Grid>
    </Grid>
  )
}

export default LanguagePage
