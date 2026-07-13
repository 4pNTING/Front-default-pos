export enum ICustomerSortField {
    customId = 'customId',
    fullname = 'fullname',
    firstName = 'firstName',
    lastName = 'lastName',
    gender = 'gender',
    nationality = 'nationality',
    phoneNumber = 'phoneNumber',
    address = 'address',
    province = 'province',
    district = 'district',
    village = 'village',
}
export enum IElectricSortField {
    name = 'name',
    status = 'status',
}
export enum IFixedAmountSortField {
    amount = 'amount',
    method = 'method',
    selection = 'selection',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum ILeasingBatchElectricSortField {
    name = 'name',
    note = 'note',
    status = 'status',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum ILeasingBatchElectricDetailSortField {
    uniqueId = 'uniqueId',
    lastNumber = 'lastNumber',
    currentNumber = 'currentNumber',
    unitAmount = 'unitAmount',
    amount = 'amount',
    sumUnitAmount = 'sumUnitAmount',
    electricityConversionFee = 'electricityConversionFee',
    sumAmount = 'sumAmount',
    currency = 'currency',
    status = 'status',
    invoiceNo = 'invoiceNo',
    receiptNo = 'receiptNo',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum ILeasingBatchWaterSortField {
    name = 'name',
    note = 'note',
    status = 'status',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum ILeasingBatchWaterDetailSortField {
    uniqueId = 'uniqueId',
    lastNumber = 'lastNumber',
    currentNumber = 'currentNumber',
    unitAmount = 'unitAmount',
    amount = 'amount',
    sumUnitAmount = 'sumUnitAmount',
    maintenanceAmount = 'maintenanceAmount',
    sumAmount = 'sumAmount',
    currency = 'currency',
    status = 'status',
    invoiceNo = 'invoiceNo',
    receiptNo = 'receiptNo',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum ILeasingElectricSortField {
    uniqueId = 'uniqueId',
    lastNumber = 'lastNumber',
    status = 'status',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',

    // join customer
    customerFullName = 'customerFullName',
    customerFirstName = 'customerFirstName',
    customerLastName = 'customerLastName',

    // leasingIndex
    leasingIndexNo = 'leasingIndexNo',

    // join electric
    electricNo = 'electricNo',
}
export enum ILeasingIndexSortField {
    leasingIndexNo = 'leasingIndexNo',
    contractNo = 'contractNo',
    shopName = 'shopName',
    status = 'status',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',

    // join
    customerFullName = 'customerFullName',
    customerFirstName = 'customerFirstName',
    customerLastName = 'customerLastName',

    // join leasing order with room
    roomAreaName = 'roomAreaName',
}
export enum ILeasingWaterSortField {
    uniqueId = 'uniqueId',
    lastNumber = 'lastNumber',
    status = 'status',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum IRoomAreaSortField {
    name = 'name',
    wide = 'wide',
    long = 'long',
    totalArea = 'totalArea',
    amount = 'amount',
    totalAmount = 'totalAmount',
    status = 'status',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',

    // join zone
    zoneName = 'zoneName',

    // join roomAreaCategory
    roomAreaCategoryName = 'roomAreaCategoryName',
}

export enum IRoomAreaCategorySortField {
    name = 'name',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum IShopCategorySortField {
    name = 'name',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum IWaterSortField {
    name = 'name',
    status = 'status',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum IZoneSortField {
    name = 'name',
    uniqueId = 'uniqueId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
export enum ICategorySortField {
    name = 'name',
    description = 'description',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}
