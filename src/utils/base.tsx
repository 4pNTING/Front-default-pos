export enum IEntityStatus {
  all = "all",
  active = "active",
  inactive = "inactive",
  empty = "empty",
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






export enum IPosFileType {
  posCustomer = "posCustomer",
  mmsCustomer = "posCustomer",
}

export { IPosFileType as ILeasingFileType };

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  category = "category",
  customer = "customer",
  menuItem = "menuItem",
  posCard = "posCard",
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
