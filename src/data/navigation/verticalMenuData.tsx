// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  // Overview / Main System
  {
    label: dictionary.dashboards,
    icon: 'tabler-layout-dashboard',
    href: '/dashboard'
  },
  {
    label: dictionary.posPage?.title ,
    icon: 'tabler-cash-register',
    href: '/pos'
  },

  // Restaurant Management
  {
    label: dictionary.pageBreadcrumbs?.manageData ?? dictionary.navigation?.appsPages,
    isSection: true,
    children: [
      {
        label: dictionary.menuItemPage?.title,
        icon: 'tabler-tools-kitchen-2',
        href: '/menuitem'
      },
      {
        label: dictionary.category,
        icon: 'tabler-category',
        href: '/category'
      },
      {
        label: dictionary.tablePage?.title,
        icon: 'tabler-armchair',
        href: '/table'
      },
      {
        label: dictionary.zone,
        icon: 'tabler-map-pin',
        href: '/zone'
      },
      {
        label: dictionary.customer,
        icon: 'tabler-users',
        href: '/customer'
      }
    ]
  },

  // Settings
  {
    label: dictionary.navigation?.settings,
    isSection: true,
    children: [
      {
        label: dictionary.changeLanguage,
        icon: 'tabler-language',
        href: '/language'
      }
    ]
  }
]

export default verticalMenuData
