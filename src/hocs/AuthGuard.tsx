// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { authOptions } from '@/libs/auth'
import React from 'react'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const session = await getServerSession(authOptions)
  return <>{session ? React.cloneElement(children as React.ReactElement, { session }) : <AuthRedirect lang={locale} />}</>
}
