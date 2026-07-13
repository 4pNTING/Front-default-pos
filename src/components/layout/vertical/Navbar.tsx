
// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'
import { PageDefaultProps } from '@/types/pageDefaultTypes'

const Navbar = ({ props }: { props: PageDefaultProps }) => {
  return (
    // <LayoutNavbar>
    <NavbarContent props={props} />
    // </LayoutNavbar>
  )
}

export default Navbar
