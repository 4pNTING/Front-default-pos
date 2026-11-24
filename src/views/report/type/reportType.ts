import { getDictionary } from "@/utils/getDictionary";
import { OrderType, POSTableType } from "@/views/pos/type/posType";

export type ReportListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

export type DateRangePreset = "today" | "yesterday" | "week" | "month" | "all" | "custom";

export interface ReportSummaryType {
  totalRevenue: number;
  totalDiscount: number;
  totalOrdersCount: number;
  avgOrderValue: number;
  paidOrdersCount: number;
  cancelledOrdersCount: number;
}

export interface TopSellingItemType {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  totalRevenue: number;
  percentage: number;
}

export interface PrintableReceiptModalData {
  orderNumber: string;
  tableNumber: string;
  zoneName?: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    note?: string;
  }>;
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  staffName?: string;
}
