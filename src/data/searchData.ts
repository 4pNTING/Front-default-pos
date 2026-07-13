type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'Dashboards',
    url: '/dashboards',
    icon: 'tabler-chart-pie-2',
    section: 'Dashboards'
  }
]

export default data
