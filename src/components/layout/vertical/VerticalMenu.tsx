"use client";

// Next Imports
import { useParams } from "next/navigation";

// MUI Imports
import { useTheme } from "@mui/material/styles";
import { Typography, Switch, Avatar } from "@mui/material";
import { toast } from "react-toastify";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// Type Imports
import type { getDictionary } from "@/utils/getDictionary";
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu";

// NOTE: Original Type Import is commented out.
// import type { RoleMenu } from '@/gql/models/graphql';

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from "@menu/vertical-menu";
import LanguageDropdown from "@components/layout/shared/LanguageDropdown";
import ModeDropdown from "@components/layout/shared/ModeDropdown";
import UserDropdown from "@components/layout/shared/UserDropdown";

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";
import { useSettings } from "@core/hooks/useSettings";

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";
import { useRoleStore } from "@/views/role/store/roleStore";

// React/NextAuth
import React, { useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";

// Loader
import SkeletonLoader from "@/components/loading/list/ListLoader";

// ====================================================================================
// TEMPORARY TYPE DEFINITION for RoleMenu (If you get the actual type, replace this)
// ====================================================================================
interface TempRoleMenu {
  enSection?: string | null;
  laSection?: string | null;
  enMenu?: string | null;
  laMenu?: string | null;
  href?: string | null;
  icon?: string | null;
  subMenu?: TempRoleMenu[] | null;
  feature?: string;
  [key: string]: any;
}

// Alias the temporary type to RoleMenu to satisfy the component's internal logic
type RoleMenu = TempRoleMenu;



type RenderExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
  lang: string;
  props?: any;
};

const RenderExpandIcon = ({
  open,
  transitionDuration,
}: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ dictionary, scrollMenu, lang }: Props) => {
  // Hooks
  const session = useSession();
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const params = useParams();
  const { isBreakpointReached } = useVerticalNav();
  const { isCollapsed, isHovered } = verticalNavOptions;

  // Vars
  const { transitionDuration } = verticalNavOptions;
  const locale = (params?.lang as string) || lang;
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  // ===== Role store =====
  // Note: We cast 'role' to 'any' here if the useRoleStore hook doesn't use our TempRoleMenu
  const { queryRoleById, role, loading } = useRoleStore() as {
    queryRoleById: any;
    role: { menus: RoleMenu[] } | null;
    loading: boolean;
  };

  useEffect(() => {
    if (session?.status === "authenticated" && session?.data?.user) {
      const user = session.data.user as any;
      const roleIdentifier = user.level || "";

      if (roleIdentifier) {
        queryRoleById({
          props: { queryRoles: "", dictionary },
          id: roleIdentifier,
        });
      }
    }
  }, [session, queryRoleById, dictionary]);

  // ===== THEME via useSettings (แหล่งความจริงของธีม) =====
  const { settings, updateSettings } = useSettings();

  // sync <html> + localStorage ให้สอดคล้องกับ settings.mode
  useEffect(() => {
    const mode = settings.mode === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-mui-color-scheme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    try {
      localStorage.setItem("app-color-scheme", mode);
    } catch { }
  }, [settings.mode]);

  const handleThemeSwitch = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    updateSettings({ mode: checked ? "dark" : "light" });
  };

  const filteredMenus = React.useMemo(() => {
    return role?.menus || [];
  }, [role?.menus]);

  const handleUserLogout = async () => {
    try {
      // Sign out from the app

      await signOut({ callbackUrl: "/login" });
      toast.success("Logout success!");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };
  const roleDefault = {
    data: {
      Role: {
        _id: "67643abba78e121bcea07a53",
        createdAt:
          "Thu Dec 19 2024 15:24:43 GMT+0000 (Coordinated Universal Time)",
        updatedAt:
          "Thu Dec 19 2024 15:24:43 GMT+0000 (Coordinated Universal Time)",
        laName: "Super Admin",
        enName: "Super Admin",
        systemCode: "Supper",
        menus: [
          {
            href: "/logout",
            icon: "tabler-logout",
            exactMatch: false,
            laMenu: "ອອກຈາກລະບົບ",
            enMenu: "Logout",
            laSection: "",
            enSection: "",
            permission: ["c", "r", "u", "d"],
            subMenu: [],
            type: "button",
            cb: async () => {
              handleUserLogout();
            },
          },
        ],
        __typename: "Role",
      },
    },
  };

  // Group items by Section
  const menuDefaultBySection = roleDefault?.data?.Role?.menus?.reduce(
    (acc, item) => {
      const section = item?.enSection || "other";
      acc[section] = [...(acc[section] || []), item];
      return acc;
    },
    {} as Record<string, Array<any & { type?: string; cb?: any }>>,
  );
  const menuBySection = filteredMenus.reduce(
    (acc, item) => {
      const section = item?.enSection || "other";
      acc[section] = [...(acc[section] || []), item];
      return acc;
    },
    {} as Record<string, RoleMenu[]>,
  );

  // Render menu
  const renderMenuContent = () => (
    <Menu
      popoutMenuOffset={{ mainAxis: 23 }}
      menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
      renderExpandIcon={({ open }) => (
        <RenderExpandIcon open={open} transitionDuration={transitionDuration} />
      )}
      renderExpandedMenuItemIcon={{
        icon: <i className="tabler-circle text-xs" />,
      }}
      menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
    >
      {/* FIX: Explicitly type the entries as [string, RoleMenu[]] 
        to ensure 'items' is recognized as an array with the '.map' method.
      */}
      {Object.entries(menuBySection ?? {})
        .map(([section, items]: [string, RoleMenu[]]) => {
          if (section === "other") {
            return items.map((item, itemIndex) => (
              <MenuItem
                key={`other-${item.href}-${itemIndex}`}
                href={`/${locale}${item.href}`}
                icon={<i className={item.icon ?? "tabler-circle-dot-filled"} />}
              >
                {lang.startsWith("la")
                  ? item.laMenu ?? "*"
                  : item.enMenu ?? "*"}
              </MenuItem>
            ));
          }

          return (
            <MenuSection
              key={`section-${section}`}
              label={
                lang.startsWith("la")
                  ? items[0]?.laSection ?? section
                  : items[0]?.enSection ?? section
              }
            >
              {items?.map((item, index) => {
                if (item?.subMenu?.length) {
                  // ถ้ากลุ่มนี้มี Light/Dark หรือ ສະຫວ່າງ/ມື້ດ → แทนที่ด้วยสวิตช์ตัวเดียว (Basic Switch)
                  const hasThemeOptions = item.subMenu.some(
                    (s) =>
                      s?.enMenu === "Light" ||
                      s?.enMenu === "Dark" ||
                      s?.laMenu === "ສະຫວ່າງ" ||
                      s?.laMenu === "ມື້ດ",
                  );

                  if (hasThemeOptions) {
                    const label = lang.startsWith("la")
                      ? item.laMenu ?? "ຮູບແບບແສງ"
                      : item.enMenu ?? "Theme";

                    return (
                      <MenuItem
                        key={`theme-switch-${section}-${index}`}
                        icon={<i className={item.icon ?? "tabler-sun-moon"} />}
                      // หลีกเลี่ยง onClick ป้องกัน event ของ Switch
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {label}{" "}
                            <small className="opacity-60">
                              {
                                settings.mode === "dark"
                                // ? (lang.startsWith('la') ? '(ມື້ດ)' : '(Dark)')
                                // : (lang.startsWith('la') ? '(ສະຫວ່າງ)' : '(Light)')}
                              }{" "}
                            </small>
                          </span>
                          <Switch
                            size="small"
                            checked={settings.mode === "dark"}
                            onChange={handleThemeSwitch}
                            inputProps={{ "aria-label": "toggle theme" }}
                          />
                        </div>
                      </MenuItem>
                    );
                  }

                  // กลุ่มทั่วไป → แสดงเป็น SubMenu ตามเดิม
                  return (
                    <SubMenu
                      key={`submenu-${section}-${item.href}-${index}`}
                      label={
                        lang.startsWith("la")
                          ? item.laMenu ?? "*"
                          : item.enMenu ?? "*"
                      }
                      icon={
                        <i
                          className={item.icon ?? "tabler-circle-dot-filled"}
                        />
                      }
                    >
                      {item.subMenu.map((subItem, subIndex) => (
                        <MenuItem
                          key={`${section}-${item.href}-sub-${subIndex}-${subItem?.href ?? `item-${subIndex}`}`}
                          href={`/${locale}${subItem?.href}`}
                        >
                          {lang.startsWith("la")
                            ? subItem?.laMenu ?? "*"
                            : subItem?.enMenu ?? "*"}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  );
                }

                // เมนูเดี่ยว: ตรวจ Logout
                // const isLogout =
                //   item?.laMenu === "ອອກຈາກລະບົບ" || item?.enMenu === "Logout";
                // if (isLogout) {
                //   return (
                //     <MenuItem
                //       key={`${section}-logout-${index}`}
                //       onClick={() =>
                //         signOut({ callbackUrl: "/login", redirect: true })
                //       }
                //       icon={
                //         <i
                //           className={item.icon ?? "tabler-circle-dot-filled"}
                //         />
                //       }
                //     >
                //       {lang.startsWith("la")
                //         ? item?.laMenu ?? "*"
                //         : item?.enMenu ?? "*"}
                //     </MenuItem>
                //   );
                // }

                // เมนูเดี่ยวทั่วไป
                return (
                  <MenuItem
                    key={`${section}-item-${item.href}-${index}`}
                    href={`/${locale}${item.href}`}
                    icon={
                      <i className={item.icon ?? "tabler-circle-dot-filled"} />
                    }
                  >
                    {lang.startsWith("la")
                      ? item?.laMenu ?? "*"
                      : item?.enMenu ?? "*"}
                  </MenuItem>
                );
              })}
            </MenuSection>
          );
        })
        .flat()}
    </Menu>
  );

  const renderDefaultMenuContent = () => (
    <Menu
      popoutMenuOffset={{ mainAxis: 23 }}
      menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
      renderExpandIcon={({ open }) => (
        <RenderExpandIcon open={open} transitionDuration={transitionDuration} />
      )}
      renderExpandedMenuItemIcon={{
        icon: <i className="tabler-circle text-xs" />,
      }}
      menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
    >
      {Object.entries(menuDefaultBySection ?? {}).map(([section, items]) => (
        <React.Fragment key={section}>
          {section === "other" ? (
            items.map((item) => {
              if (item?.type === "button") {
                return (
                  <MenuItem
                    key={item.href}
                    onClick={() => item.cb()}
                    icon={
                      <i className={item.icon ?? "tabler-circle-dot-filled"} />
                    }
                  >
                    {lang.startsWith("la")
                      ? item.laMenu ?? "*"
                      : item.enMenu ?? "*"}
                  </MenuItem>
                );
              } else {
                return (
                  <MenuItem
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    icon={
                      <i className={item.icon ?? "tabler-circle-dot-filled"} />
                    }
                  >
                    {lang.startsWith("la")
                      ? item.laMenu ?? "*"
                      : item.enMenu ?? "*"}
                  </MenuItem>
                );
              }
            })
          ) : (
            <MenuSection
              label={
                lang.startsWith("la")
                  ? items[0].laSection ?? "*"
                  : items[0].enSection ?? "*"
              }
            >
              {items?.map((item) =>
                item?.subMenu?.length ? (
                  <>
                    <SubMenu
                      key={item.href}
                      label={
                        lang.startsWith("la")
                          ? item.laSection ?? "*"
                          : item.enSection ?? "*"
                      }
                      icon={
                        <i
                          className={item.icon ?? "tabler-circle-dot-filled"}
                        />
                      }
                    >
                      {item.subMenu.map((subItem) => (
                        <MenuItem
                          key={subItem?.href ?? "sub"}
                          href={`/${locale}${subItem?.href}`}
                        >
                          {lang.startsWith("la")
                            ? subItem?.laMenu ?? "*"
                            : subItem?.enMenu ?? "*"}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  </>
                ) : (
                  <MenuItem
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    icon={
                      <i className={item.icon ?? "tabler-circle-dot-filled"} />
                    }
                  >
                    {lang.startsWith("la")
                      ? item?.laMenu ?? "*"
                      : item?.enMenu ?? "*"}
                  </MenuItem>
                ),
              )}
            </MenuSection>
          )}
        </React.Fragment>
      ))}
    </Menu>
  );

  if (loading) return <SkeletonLoader />;

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: "bs-full overflow-y-auto overflow-x-hidden",
          onScroll: (container) => scrollMenu(container, false),
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: (container) => scrollMenu(container, true),
        })}
    >
      {role != null ? (
        <>
          {!isCollapsed || isHovered ? (
            <div className="px-4 py-3">
              <div
                className="flex flex-row items-center justify-start p-3 rounded-2xl border border-dashed hover:shadow-sm transition-all duration-300 cursor-pointer group gap-3"
                style={{
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.divider,
                }}
              >
                <Avatar
                  alt={session?.data?.user?.username || ""}
                  src={session?.data?.user?.username || ""}
                  sx={{ width: 40, height: 40, boxShadow: 2 }}
                  className="group-hover:scale-110 transition-transform duration-300 border-2 border-background"
                />
                <div className="flex flex-col items-start gap-1 overflow-hidden">
                  <Typography
                    className="font-bold text-base tracking-tight truncate w-full"
                    color="text.primary"
                  >
                    {session?.data?.user?.username || ""}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="font-bold uppercase text-[10px] leading-tight"
                    color="primary"
                  >
                    {session?.data?.user?.level || ""}
                  </Typography>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-3">
              <Avatar
                alt={session?.data?.user?.username || ""}
                src={session?.data?.user?.username || ""}
                sx={{ width: 40, height: 40, boxShadow: 1 }}
                className="border-2 border-background cursor-pointer"
              />
            </div>
          )}
          {renderMenuContent()}
          {renderDefaultMenuContent()}
        </>
      ) : (
        <>
          <Typography
            textAlign={"center"}
            alignSelf={"center"}
            padding={"20px"}
          >
            {dictionary.noMenuDataAvailable}
          </Typography>
          {renderDefaultMenuContent()}
          {/* <MenuSection label="">
            <MenuItem
              key={`item-singout`}
              href={`/${locale}/logout`}
              icon={<i className={"tabler-circle-dot-filled"} />}
            >
              {lang.startsWith("la") ? "ອອກຈາກລະບົບ" : "logout"}
            </MenuItem>
          </MenuSection> */}
        </>
      )}
    </ScrollWrapper>
  );
};

export default VerticalMenu;
