// Next Imports
import { redirect } from "next/navigation";

// Third-party Imports
import { getServerSession } from "next-auth";

// Type Imports
import type { ChildrenType } from "@core/types";
import type { Locale } from "@configs/i18n";

// Config Imports
import themeConfig from "@configs/themeConfig";

// Util Imports
import { getLocalizedUrl } from "@/utils/i18n";
import { useSession } from "next-auth/react";

const GuestOnlyRoute = async ({
  children,
  lang,
}: ChildrenType & { lang: Locale }) => {
  // const session = await getServerSession();
  // const { data: session } = useSession();
  // console.log(`0000der`, session);
  // console.log(`0000der`, themeConfig.homePageUrl);

  // return <>{children}</>;
  // if (session) {
  //   redirect(getLocalizedUrl(themeConfig.homePageUrl, lang));
  // }

  return <>{children}</>;
};

export default GuestOnlyRoute;
