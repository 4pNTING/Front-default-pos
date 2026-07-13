export type ConditionModel = {
    field: string,
    value: any,
}

export type InNumberModel = {
    field: string,
    value: number[],
}

export type InStringModel = {
    field: string,
    value: string[],
}

export type PageginateModal = {
    page: number,
    limit: number,
}

export type SearchModal = {
    searchField: string[],
    q: string,
}

export type DateFillterModal = {
    startDate: string,
    endDate: string,
}


export type FilterModel = {
    condition?: ConditionModel[],
    inNumber?: InNumberModel[],
    inString?: InStringModel[],
    pageginate?: PageginateModal,
    search?: SearchModal,
    dateFillter?: DateFillterModal,
    sort?: number,
    join?: string[],
}

export type FilterKeyValue = {
    field: string,
    value: any,
}
