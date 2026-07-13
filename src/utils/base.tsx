export enum IEntityStatus {
  all = "all",
  active = "active",
  inactive = "inactive",
  empty = "empty",
}

export enum IWalletCardStatus {
  lost = "lost",
  inuse = "inuse",
  all = "all",
  added = "added",
  notAddedYet = "not_added_yet",
}

export enum IWalletReferenceGroup {
  bu = "bu",
  bu_member = "bu_member",
}

export enum IWalletCardType {
  staff = "staff",
  general = "general",
}

export enum IIssuedStatus {
  all = "all",
  pending = "pending",
  paid = "paid",
  denied = "denied",
}

export enum ITopupBatchTarget {
  all = "all",
  card = "card",
  wallet = "wallet",
}
export enum ITopupBatchStatus {
  all = "all",
  pending = "pending",
  confirm = "confirm",
  denied = "denied",
  processing = "processing",
}

export enum ILeasingEWInvoiceStatus {
  approved_and_no_invoice = "approved_and_no_invoice",
  approved_and_invoice = "approved_and_invoice",
  pending = "pending",
}

export const currencyFormatInput = (value: string) => {
  // Remove all non-numeric and non-dot characters
  value = value.replace(/[^0-9.]/g, "");

  // Ensure only one decimal point exists
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join(""); // Keep only the first dot
  }

  // Format the integer part with commas
  let [integer, decimal] = value.split(".");
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Limit decimal places to 2
  if (decimal?.length > 2) {
    decimal = decimal.slice(0, 2);
  }

  return decimal !== undefined ? `${integer}.${decimal}` : integer;
};

export enum IRoleConfigLevel {
  system = "system",
  service = "service",
  serviceAutomation = "serviceAutomation",
  requestor = "requestor",
  acceptor = "acceptor",
  bu = "bu",
  bu_member = "bu_member",
  merchant = "merchant",
  member = "member",
  card = "card",
  admin = "admin",
  superAdmin = "superAdmin",
}

export enum IRoomAreaHoldStatus {
  rent = "rent",
  buyer = "buyer",
}

export enum IRoomAreaStatus {
  using = "using",
  empty = "empty",
}

export enum IRoomAreaAgentHoldStatus {
  owner = "owner",
  agent = "agent",
  bu = "bu",
}

export enum IRoomAreaCurrency {
  LAK = "LAK",
  USD = "USD",
  THB = "THB",
}
export enum ICustomerGender {
  male = "male",
  female = "female",
}
export enum ICustomerNationality {
  lao = "lao",
  chinese = "chinese",
  thai = "thai",
  vietnamese = "vietnamese",
  thailao = "thailao",
  none = "none",
  korea = "korea",
}

export enum ILeasingIndexPaymentMethod {
  month = "month",
  installment = "installment",
}
export enum ILeasingIndexContractCategory {
  buy_sell = "buy_sell",
  rent = "rent",
}
export enum ILeasingIndexStatus {
  pending_approve = "pending_approve",
  pending_active = "pending_active",
  pending_approve_edit = "pending_approve_edit",
  pending_cancel = "pending_cancel",
  pending_approve_resubmit = "pending_approve_resubmit",

  rejected = "rejected",
  actived = "actived",
  expired = "expired",
  ended = "ended",
  cancelled = "cancelled",
  deleted = "deleted",
  invalid = "invalid",
}

export enum ILeasingBatchElectricStatus {
  pending_submit = "pending_submit",
  pending_approve = "pending_approve",
  approved = "approved",
}

export enum IFixedAmountMethod {
  electric_amount_kwh = "electric_amount_kwh",
  water_amount_per_unit = "water_amount_per_unit",
  water_maintenance_amount = "water_maintenance_amount",
}

// Water batch ใช้ status เดียวกับ Electric
export const ILeasingBatchWaterStatus = ILeasingBatchElectricStatus;
export type ILeasingBatchWaterStatus = ILeasingBatchElectricStatus;

export enum ILeasingFileType {
  mmsLeasing = "mmsLeasing",
  mmsCancelLeasing = "mmsCancelLeasing",
  mmsCustomer = "mmsCustomer",
  mmsRoomAreaOwnership = "mmsRoomAreaOwnership",
  mmsRoomAreaOwnershipAgent = "mmsRoomAreaOwnershipAgent",
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRoomCategoryInfo(value: string) {
  const dict = {
    company: { id: "1", code: "ຫ້ອງບໍລິສັດ", color: "info" },
    "1": { id: "1", code: "ຫ້ອງບໍລິສັດ", color: "info" },
    purchase: { id: "2", code: "ຫ້ອງຊື້", color: "success" },
    "2": { id: "2", code: "ຫ້ອງຊື້", color: "success" },
  } as const;

  const m = (dict as any)[value];
  if (!m) return undefined;
  return { color: m.color, label: m.code }; // ← ใช้ code เສมอ
}

export function getOwnershipTypeInfo(value: string) {
  const dict = {
    owner_occupied: { id: "1", code: "ເຈົ້າຂອງຢູ່ເອງ", color: "success" },
    "1": { id: "1", code: "ເຈົ້າຂອງຢູ່ເອງ", color: "success" },
    transfer_management: { id: "2", code: "ໂອນສິດບໍລິຫານ", color: "warning" },
    "2": { id: "2", code: "ໂອນສິດບໍລິຫານ", color: "warning" },
  } as const;

  const m = (dict as any)[value];
  if (!m) return undefined;
  return { color: m.color, label: m.code }; // ← ใช้ code เสมอ
}

export function getCurrencyColor(currencyCode: string): string {
  const colorMap: Record<string, string> = {
    LAK: "#1976d2",
    THB: "#d32f2f",
    USD: "#388e3c",
  };
  return colorMap[currencyCode] || "#1976d2";
}

export function formatCurrency(
  amount: number,
  currencySymbol: string = "₭",
  currencyCode: string = "LAK",
): { text: string; color: string } | string {
  if (!amount) return "-";
  const color = getCurrencyColor(currencyCode);
  return {
    text: `${currencySymbol} ${amount.toLocaleString()}`,
    color,
  };
}

export enum IUserPermissionFeature {
  customer = "customer",
  electric = "electric",
  fixedAmount = "fixedAmount",
  leasingBatchElectric = "leasingBatchElectric",
  leasingBatchElectricDetail = "leasingBatchElectricDetail",
  leasingBatchWater = "leasingBatchWater",
  leasingBatchWaterDetail = "leasingBatchWaterDetail",
  leasingElectric = "leasingElectric",
  leasingEWInvoice = "leasingEWInvoice",
  leasingExpired = "leasingExpired",
  salesReport = "salesReport",
  leasingIndex = "leasingIndex",
  leasingWater = "leasingWater",
  roomArea = "roomArea",
  roomAreaCategory = "roomAreaCategory",
  shopCategory = "shopCategory",
  user = "user",
  water = "water",
  zone = "zone",
}

export enum IUserLevel {
  admin = "admin",
  user = "user",
  saleOfficer = "saleOfficer",
  saleManager = "saleManager",
  buildingOfficer = "buildingOfficer",
  buildingManager = "buildingManager",
  collectionManager = "collectionManager",
  collectionOfficer = "collectionOfficer",
}

export enum IUserPermissionAction {
  c = "c",
  r = "r",
  u = "u",
  d = "d",
  rd = "rd",
}

export enum ISalesReportType {
  new = "new",
  renew = "renew",
}
