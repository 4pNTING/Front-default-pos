// 'use client';

// // Next Imports
// import { useParams } from 'next/navigation';

// // MUI Imports
// import { useTheme } from '@mui/material/styles';
// import { Typography, Switch } from '@mui/material';

// // Third-party Imports
// import PerfectScrollbar from 'react-perfect-scrollbar';

// // Type Imports
// import type { getDictionary } from '@/utils/getDictionary';
// import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu';
// import type { RoleMenu } from '@/gql/models/graphql';

// // Component Imports
// import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu';
// import LanguageDropdown from '@components/layout/shared/LanguageDropdown';
// import ModeDropdown from '@components/layout/shared/ModeDropdown';
// import UserDropdown from '@components/layout/shared/UserDropdown';

// // Hook Imports
// import useVerticalNav from '@menu/hooks/useVerticalNav';
// import { useSettings } from '@core/hooks/useSettings';

// // Styled Component Imports
// import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon';

// // Style Imports
// import menuItemStyles from '@core/styles/vertical/menuItemStyles';
// import menuSectionStyles from '@core/styles/vertical/menuSectionStyles';
// import { useRoleStore } from '@/views/role/store/roleStore';

// // React/NextAuth
// import React, { useEffect } from 'react';
// import { useSession, signOut } from 'next-auth/react';

// // Loader
// import SkeletonLoader from '@/components/loading/list/ListLoader';

// type RenderExpandIconProps = {
//   open?: boolean;
//   transitionDuration?: VerticalMenuContextProps['transitionDuration'];
// };

// type Props = {
//   dictionary: Awaited<ReturnType<typeof getDictionary>>;
//   scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
//   lang: string;
//   props?: any;
// };

// const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
//   <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
//     <i className="tabler-chevron-right" />
//   </StyledVerticalNavExpandIcon>
// );

// const VerticalMenu = ({ dictionary, scrollMenu, lang }: Props) => {
//   // Hooks
//   const session = useSession();
//   const theme = useTheme();
//   const verticalNavOptions = useVerticalNav();
//   const params = useParams();
//   const { isBreakpointReached } = useVerticalNav();

//   // Vars
//   const { transitionDuration } = verticalNavOptions;
//   const locale = (params?.lang as string) || lang;
//   const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar;

//   // ===== Role store =====
//   const { queryRoleById, role, loading } = useRoleStore();
//   useEffect(() => {
//     if (session) {
//       const roleId = session.data?.user?.level + '';
//       if (roleId !== '') {
//         queryRoleById({
//           props: { queryRoles: '', dictionary },
//           id: roleId
//         });
//       }
//     }
//   }, [session, queryRoleById, dictionary]);

//   // ===== THEME via useSettings (แหล่งความจริงของธีม) =====
//   const { settings, updateSettings } = useSettings();

//   // sync <html> + localStorage ให้สอดคล้องกับ settings.mode
//   useEffect(() => {
//     const mode = settings.mode === 'dark' ? 'dark' : 'light';
//     document.documentElement.setAttribute('data-mui-color-scheme', mode);
//     document.documentElement.classList.toggle('dark', mode === 'dark');
//     try {
//       localStorage.setItem('app-color-scheme', mode);
//     } catch {}
//   }, [settings.mode]);

//   const handleThemeSwitch = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
//     updateSettings({ mode: checked ? 'dark' : 'light' });
//   };

//   // Group items by Section
//   const menuBySection = role?.menus?.reduce(
//     (acc, item) => {
//       const section = item?.enSection || 'other';
//       acc[section] = [...(acc[section] || []), item];
//       return acc;
//     },
//     {} as Record<string, RoleMenu[]>
//   );

//   // Render menu
//   const renderMenuContent = () => (
//     <Menu
//       popoutMenuOffset={{ mainAxis: 23 }}
//       menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
//       renderExpandIcon={({ open }) => (
//         <RenderExpandIcon open={open} transitionDuration={transitionDuration} />
//       )}
//       renderExpandedMenuItemIcon={{ icon: <i className="tabler-circle text-xs" /> }}
//       menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
//     >
//       {Object.entries(menuBySection ?? {}).map(([section, items]) => {
//         if (section === 'other') {
//           return items.map((item, itemIndex) => (
//             <MenuItem
//               key={`other-${item.href}-${itemIndex}`}
//               href={`/${locale}${item.href}`}
//               icon={<i className={item.icon ?? 'tabler-circle-dot-filled'} />}
//             >
//               {lang.startsWith('la') ? item.laMenu ?? '*' : item.enMenu ?? '*'}
//             </MenuItem>
//           ));
//         }

//         // แต่ละ Section จะเป็น SubMenu หนึ่งตัว
//         const sectionLabel = lang.startsWith('la') ? items[0]?.laSection ?? section : items[0]?.enSection ?? section;
//         const sectionIcon = items[0]?.icon || 'tabler-folder';

//         return (
//           <SubMenu
//             key={`section-submenu-${section}`}
//             label={sectionLabel}
//             icon={<i className={sectionIcon} />}
//           >
//             {items?.map((item, index) => {
//               // ถ้า item มี subMenu ของตัวเอง (nested submenu)
//               if (item?.subMenu?.length) {
//                 // ถ้ากลุ่มนี้มี Light/Dark หรือ ສະຫວ່າງ/ມື້ດ → แทนที่ด้วยสวิตช์
//                 const hasThemeOptions = item.subMenu.some(
//                   s =>
//                     s?.enMenu === 'Light' ||
//                     s?.enMenu === 'Dark' ||
//                     s?.laMenu === 'ສະຫວ່າງ' ||
//                     s?.laMenu === 'ມື້ດ'
//                 );

//                 if (hasThemeOptions) {
//                   const label = lang.startsWith('la') ? item.laMenu ?? 'ທີມ' : item.enMenu ?? 'Theme';
//                   return (
//                     <MenuItem
//                       key={`theme-switch-${section}-${index}`}
//                       icon={<i className={item.icon ?? 'tabler-sun-moon'} />}
//                     >
//                       <div className="flex items-center justify-between w-full">
//                         <span>{label}</span>
//                         <Switch
//                           size="small"
//                           checked={settings.mode === 'dark'}
//                           onChange={handleThemeSwitch}
//                           inputProps={{ 'aria-label': 'toggle theme' }}
//                         />
//                       </div>
//                     </MenuItem>
//                   );
//                 }

//                 // กลุ่มทั่วไป → แสดงเป็น SubMenu ซ้อน
//                 return (
//                   <SubMenu
//                     key={`nested-submenu-${section}-${item.href}-${index}`}
//                     label={lang.startsWith('la') ? item.laMenu ?? '*' : item.enMenu ?? '*'}
//                     icon={<i className={item.icon ?? 'tabler-circle-dot-filled'} />}
//                   >
//                     {item.subMenu.map((subItem, subIndex) => (
//                       <MenuItem
//                         key={`${section}-${item.href}-sub-${subIndex}-${subItem?.href ?? `item-${subIndex}`}`}
//                         href={`/${locale}${subItem?.href}`}
//                       >
//                         {lang.startsWith('la') ? subItem?.laMenu ?? '*' : subItem?.enMenu ?? '*'}
//                       </MenuItem>
//                     ))}
//                   </SubMenu>
//                 );
//               }

//               // เมนูเดี่ยว: ตรวจ Logout
//               const isLogout = item?.laMenu === 'ອອກຈາກລະບົບ' || item?.enMenu === 'Logout';
//               if (isLogout) {
//                 return (
//                   <MenuItem
//                     key={`${section}-logout-${index}`}
//                     onClick={() => signOut({ callbackUrl: '/login', redirect: true })}
//                     icon={<i className={item.icon ?? 'tabler-circle-dot-filled'} />}
//                   >
//                     {lang.startsWith('la') ? item?.laMenu ?? '*' : item?.enMenu ?? '*'}
//                   </MenuItem>
//                 );
//               }

//               // เมนูเดี่ยวทั่วไป
//               return (
//                 <MenuItem
//                   key={`${section}-item-${item.href}-${index}`}
//                   href={`/${locale}${item.href}`}
//                   icon={<i className={item.icon ?? 'tabler-circle-dot-filled'} />}
//                 >
//                   {lang.startsWith('la') ? item?.laMenu ?? '*' : item?.enMenu ?? '*'}
//                 </MenuItem>
//               );
//             })}
//           </SubMenu>
//         );
//       }).flat()}
//     </Menu>
//   );

//   if (loading) return <SkeletonLoader />;

//   return (
//     <ScrollWrapper
//       {...(isBreakpointReached
//         ? { className: 'bs-full overflow-y-auto overflow-x-hidden', onScroll: container => scrollMenu(container, false) }
//         : { options: { wheelPropagation: false, suppressScrollX: true }, onScrollY: container => scrollMenu(container, true) })}
//     >
//       {role != null ? (
//         renderMenuContent()
//       ) : (
//         <Typography textAlign={'center'} alignSelf={'center'} padding={'20px'}>
//           {dictionary.noMenuDataAvailable}
//         </Typography>
//       )}
//     </ScrollWrapper>
//   );
// };

// export default VerticalMenu;
