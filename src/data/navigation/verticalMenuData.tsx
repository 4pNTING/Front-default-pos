// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  // This is how you will normally render submenu
  {
    label: dictionary.dashboards,
    suffix: {
      label: '5',
      color: 'error'
    },
    icon: 'tabler-smart-home',
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary.dashboards,
        icon: 'tabler-circle',
        href: '/dashboards'
      }
    ]
  },
  {
    label: dictionary['navigation'].appsPages,
    isSection: true,
    children: [
      // POS Ordering (Phase 2)
      {
        label: dictionary.posPage.title,
        icon: 'tabler-cash-register',
        children: [
          {
            label: dictionary.posPage.floorPlan,
            icon: 'tabler-circle',
            href: '/pos'
          }
        ]
      },
      // Customer Management
      {
        label: 'Customer Management',
        icon: 'tabler-users',
        children: [
          {
            label: 'Customer List',
            icon: 'tabler-circle',
            href: '/customer'
          }
        ]
      },
      // Menu Item Management
      {
        label: dictionary.menuItemPage.title,
        icon: 'tabler-meat',
        children: [
          {
            label: dictionary.menuItemPage.list,
            icon: 'tabler-circle',
            href: '/menuitem'
          }
        ]
      },
      // Table Management
      {
        label: dictionary.tablePage.title,
        icon: 'tabler-armchair',
        children: [
          {
            label: dictionary.tablePage.list,
            icon: 'tabler-circle',
            href: '/table'
          }
        ]
      },
      // Leasing Management
      {
        label: 'Leasing Management',
        icon: 'tabler-building-store',
        children: [
          {
            label: 'Leasing List',
            icon: 'tabler-circle',
            href: '/leasing'
          }
        ]
      }
    ]
  }
]

export default verticalMenuData
