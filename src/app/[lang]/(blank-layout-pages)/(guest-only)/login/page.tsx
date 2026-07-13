// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { Locale } from '@/configs/i18n'

import { getDictionary } from '@/utils/getDictionary'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

type Props = {
  params: { lang: Locale }
}


const LoginPage = async ({ params }: Props) => {
  // Vars
  const mode = getServerMode()
  const dictionary = await getDictionary(params.lang)
  return <Login mode={mode} dictionary={dictionary} lang={params.lang} />
}

export default LoginPage
