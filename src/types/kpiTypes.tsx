import { getDictionary } from "@/utils/getDictionary"
import { UsersType } from "./apps/userTypes"

export type KPIProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>
    kpi: UsersType[],
}