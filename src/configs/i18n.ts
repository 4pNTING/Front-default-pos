export const i18n = {
  defaultLocale: 'la',
  locales: ['en', 'la'],
  langDirection: {
    en: 'ltr',
    la: 'ltr',
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
