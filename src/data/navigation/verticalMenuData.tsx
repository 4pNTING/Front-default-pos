// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  // Overview / Main System
  {
    label: dictionary.dashboards ?? 'Dashboard',
    icon: 'tabler-layout-dashboard',
    href: '/dashboard'
  },
  {
    label: dictionary.posPage?.title ?? 'POS Ordering',
    icon: 'tabler-cash-register',
    href: '/pos'
  },

  // Restaurant Management
  {
    label: dictionary.pageBreadcrumbs?.manageData ?? dictionary.navigation?.appsPages ?? 'Restaurant Management',
    isSection: true,
    children: [
      {
        label: dictionary.menuItemPage?.title ?? 'Menu Items',
        icon: 'tabler-tools-kitchen-2',
        href: '/menuitem'
      },
      {
        label: dictionary.category ?? 'Categories',
        icon: 'tabler-category',
        href: '/category'
      },
      {
        label: dictionary.tablePage?.title ?? 'Tables',
        icon: 'tabler-armchair',
        href: '/table'
      },
      {
        label: dictionary.zone ?? 'Zones',
        icon: 'tabler-map-pin',
        href: '/zone'
      },
      {
        label: dictionary.customer ?? 'Customers',
        icon: 'tabler-users',
        href: '/customer'
      }
    ]
  },

  // Settings
  {
    label: dictionary.navigation?.settings ?? 'Settings',
    isSection: true,
    children: [
      {
        label: dictionary.changeLanguage ?? 'Language',
        icon: 'tabler-language',
        href: '/language'
      }
    ]
  }
]

export default verticalMenuData
