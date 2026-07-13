import { getDictionary } from "@/utils/getDictionary";

export type PageDefaultProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    lang: string,
}