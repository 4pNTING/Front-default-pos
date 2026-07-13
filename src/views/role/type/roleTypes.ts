import { UsersType } from "@/types/apps/userTypes"
import { FilterModel } from "@/types/filterTypes"
import { getDictionary } from "@/utils/getDictionary"

export type RolesListProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    lang: string,
}

export const roleMTs = {
    create: "ROLE-CREATE",
    update: "ROLE-UPDATE",
}


export type RolesFormProps = {
    handleClose: () => void,
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    lang: string,
}


export type RoleNetworkProps = {
    queryRoles?: any,
    mutateRoles?: any
    startLoading?: boolean;
    dictionary: Awaited<ReturnType<typeof getDictionary>>,
    onSuccess?: Function;
    filter?: FilterModel | null,
    setToUpdate?: boolean,
}