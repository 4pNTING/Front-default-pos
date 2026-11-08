// Imports
import { Locale } from "@/configs/i18n";
import { getDictionary } from "@/utils/getDictionary";
import PosDashboardView from "@/views/dashboard/PosDashboardView";

const DashboardPage = async ({ params }: { params: { lang: Locale } }) => {
  const dictionary = await getDictionary(params.lang);

  return <PosDashboardView lang={params.lang} dictionary={dictionary} />;
};

export default DashboardPage;
