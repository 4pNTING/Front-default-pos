import { getDictionary } from "@/utils/getDictionary";
import {
  IEntityStatus,
  IPosOrderStatus,
  IPosTableStatus,
  IPosPaymentMethod,
  IPosViewMode,
} from "@/utils/base";

import { CustomerType } from "@/views/customer/type/customerType";

export { IEntityStatus, IPosOrderStatus, IPosTableStatus, IPosPaymentMethod, IPosViewMode };
export type { CustomerType };

export type POSListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

export interface OrderItemType {
  _id?: string;
  orderId?: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
}

export interface OrderType {
  _id: string;
  orderNumber: string;
  tableId: string;
  staffId: string;
  status: IPosOrderStatus ;
  note?: string;
  subTotal: number;
  discount: number;
  total: number;
  items?: OrderItemType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItemType {
  menuItemId: string;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  note?: string;
  photo?: string;
  categoryId?: string;
}

export interface POSTableType {
  _id: string;
  number: string;
  zoneId: string;
  zoneName?: string;
  capacity: number;
  status: IPosTableStatus;
  isActive: string;
  activeOrder?: OrderType;
}

export interface CurrencyType {
  _id: string;
  code: string;
  name: string;
  isActive?: string;
}

export type POSViewMode = IPosViewMode;

export interface SetMasterDataPayload {
  rawTables: POSTableType[];
  zones: { _id: string; name: string }[];
  categories: { _id: string; name: string }[];
  menuItems: any[];
  allOrders: OrderType[];
  currencies: CurrencyType[];
  customers?: CustomerType[];
}


export interface SubmitOrderParams {
  mutations: {
    createOrderMutation: any;
    addOrderItemMutation: any;
    updateTableMutation: any;
  };
  staffId?: string;
}

export interface RemoveOrderItemParams {
  orderItemId: string;
  mutation: any;
}

export interface UpdateOrderStatusParams {
  orderId: string;
  status: string;
  mutation: any;
}

export interface CancelOrderParams {
  orderId: string;
  reason?: string;
  mutations: {
    cancelOrderMutation: any;
    updateTableMutation?: any;
  };
}

export interface ProcessPaymentParams {
  input: {
    orderId: string;
    currencyId: string;
    method: string;
    amount: number;
  };
  mutations: {
    processPaymentMutation: any;
    updateOrderStatusMutation: any;
    updateTableMutation?: any;
  };
}

export interface ReceiptItemType {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
}

export interface ReceiptDataType {
  type: 'bill' | 'receipt';
  orderNumber: string;
  tableNumber: string;
  zoneName?: string;
  staffName?: string;
  customerName?: string;
  customerPhone?: string;
  date: string;
  items: ReceiptItemType[];
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  amountReceived?: number;
  change?: number;
  currencySymbol?: string;
}

export interface TransferTableParams {
  currentTable: POSTableType;
  targetTable: POSTableType;
  currentOrder: OrderType;
  mutations: {
    transferTableMutation: any;
  };
}

export interface CashTransactionType {
  _id: string;
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
  createdAt: string;
}

export interface ShiftSalesSummaryType {
  totalSales: number;
  cashSales: number;
  qrSales: number;
  cardSales: number;
  totalOrders: number;
}

export interface ShiftType {
  _id: string;
  shiftNumber: string;
  staffId: string;
  staffName: string;
  openedAt: string;
  closedAt: string | null;
  status: 'open' | 'closed';
  startingFloat: number;
  cashTransactions: CashTransactionType[];
  actualCash?: number;
  expectedCash?: number;
  difference?: number;
  closingNotes?: string;
  salesSummary?: ShiftSalesSummaryType;
}

export interface OpenShiftParams {
  startingFloat: number;
  staffId?: string;
  staffName?: string;
}

export interface CashInOutParams {
  type: 'cash_in' | 'cash_out';
  amount: number;
  reason: string;
}

export interface CloseShiftParams {
  actualCash: number;
  closingNotes?: string;
}


