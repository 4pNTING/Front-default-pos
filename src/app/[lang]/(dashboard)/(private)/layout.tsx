// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@/hocs/AuthGuard'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import GlobalModalWrapper from '@/modal/wrapper/GlobalModalWrapper'
import { ApolloWrapper } from '@/gql/ApolloWrapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const Layout = async ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  const direction = i18n.langDirection[params.lang]
  const dictionary = await getDictionary(params.lang)
  const session = await getServerSession(authOptions)
  const mode = getMode()
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <AuthGuard locale={params.lang}>
        <ApolloWrapper session={session} dic={dictionary}>
          <LayoutWrapper
            systemMode={systemMode}
            verticalLayout={
              <VerticalLayout
                navigation={<Navigation lang={params.lang} dictionary={dictionary} mode={mode} systemMode={systemMode} props={{ lang: params.lang, dictionary: dictionary }} />}
                navbar={<Navbar props={{ lang: params.lang, dictionary: dictionary }} />}
                footer={<VerticalFooter />}
              >
                {children}
                <GlobalModalWrapper lang={params.lang} dictionary={dictionary} />
              </VerticalLayout>
            }
          />
          {/* <ScrollToTop className='mui-fixed'>
            <Button
              variant='contained'
              className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
            >
              <i className='tabler-arrow-up' />
            </Button>
          </ScrollToTop> */}
        </ApolloWrapper>
      </AuthGuard>
    </Providers>
  )
}

export default Layout
