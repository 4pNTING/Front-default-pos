import { create } from "zustand";
import { useMutation } from "@apollo/client";
import {
  OrderType,
  CartItemType,
  POSTableType,
  CurrencyType,
  POSViewMode,
  IEntityStatus,
  IPosOrderStatus,
  IPosTableStatus,
  IPosViewMode,
  SetMasterDataPayload,
  SubmitOrderParams,
  RemoveOrderItemParams,
  UpdateOrderStatusParams,
  CancelOrderParams,
  ProcessPaymentParams,
  ReceiptDataType,
  TransferTableParams,
  CustomerType,
  ShiftType,
  CashTransactionType,
  ShiftSalesSummaryType,
  OpenShiftParams,
  CashInOutParams,
  CloseShiftParams,
} from "../type/posType";
import {
  CREATE_ORDER,
  ADD_ORDER_ITEM,
  REMOVE_ORDER_ITEM,
  UPDATE_ORDER_STATUS,
  CANCEL_ORDER,
  PROCESS_PAYMENT,
  TRANSFER_TABLE,
} from "@/gql/queries/order";
import { UPDATE_TABLE } from "@/gql/queries/table";
import { CREATE_CUSTOMER } from "@/gql/queries/customer";
import { ToastService } from "@/utils/toastService";

// Mutations Hook matching zone/customer/table pattern
export const usePOSMutations = () => {
  const [createOrderMutation] = useMutation(CREATE_ORDER);
  const [addOrderItemMutation] = useMutation(ADD_ORDER_ITEM);
  const [removeOrderItemMutation] = useMutation(REMOVE_ORDER_ITEM);
  const [updateOrderStatusMutation] = useMutation(UPDATE_ORDER_STATUS);
  const [cancelOrderMutation] = useMutation(CANCEL_ORDER);
  const [processPaymentMutation] = useMutation(PROCESS_PAYMENT);
  const [updateTableMutation] = useMutation(UPDATE_TABLE);
  const [transferTableMutation] = useMutation(TRANSFER_TABLE);
  const [createCustomerMutation] = useMutation(CREATE_CUSTOMER);

  return {
    createOrderMutation,
    addOrderItemMutation,
    removeOrderItemMutation,
    updateOrderStatusMutation,
    cancelOrderMutation,
    processPaymentMutation,
    updateTableMutation,
    transferTableMutation,
    createCustomerMutation,
  };
};

interface POSState {
  // Master data
  tables: POSTableType[];
  zones: { _id: string; name: string }[];
  categories: { _id: string; name: string }[];
  menuItems: any[];
  allOrders: OrderType[];
  activeOrders: OrderType[];
  currencies: CurrencyType[];
  customers: CustomerType[];

  // Selection & Filters
  selectedTable: POSTableType | null;
  selectedCustomer: CustomerType | null;
  selectedZoneId: string;
  selectedCategoryId: string;
  menuSearchKeyword: string;
  viewMode: POSViewMode;

  // Active Order & Cart
  currentOrder: OrderType | null;
  cart: CartItemType[];
  discount: number;
  orderNote: string;

  // UI state
  loading: boolean;
  actionLoading: boolean;
  paymentModalOpen: boolean;
  moveTableModalOpen: boolean;
  customerModalOpen: boolean;
  receiptModalOpen: boolean;
  receiptData: ReceiptDataType | null;
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: (enabled: boolean) => void;

  // Refresh callbacks registered from posList
  refreshMasterData: (() => Promise<void>) | null;
  setRefreshMasterData: (fn: (() => Promise<void>) | null) => void;
  silentRefresh: (() => Promise<void>) | null;
  setSilentRefresh: (fn: (() => Promise<void>) | null) => void;

  // Shift & Cash Drawer State
  currentShift: ShiftType | null;
  lastClosedShift: ShiftType | null;
  shiftModalOpen: boolean;
  shiftModalMode: 'open' | 'manage' | 'cash_in_out' | 'close' | 'z_report';
  setShiftModalOpen: (open: boolean, mode?: 'open' | 'manage' | 'cash_in_out' | 'close' | 'z_report') => void;
  openShift: (params: OpenShiftParams) => void;
  addCashTransaction: (params: CashInOutParams) => void;
  closeShift: (params: CloseShiftParams) => ShiftType | null;
  loadStoredShift: () => void;

  // Basic Setters
  setMasterData: (data: SetMasterDataPayload) => void;
  setCustomers: (customers: CustomerType[]) => void;
  setSelectedCustomer: (customer: CustomerType | null) => void;
  setCustomerModalOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setViewMode: (mode: POSViewMode) => void;
  setSelectedZoneId: (zoneId: string) => void;
  setSelectedCategoryId: (catId: string) => void;
  setMenuSearchKeyword: (keyword: string) => void;
  setDiscount: (discount: number) => void;
  setOrderNote: (note: string) => void;
  setPaymentModalOpen: (open: boolean) => void;
  setMoveTableModalOpen: (open: boolean) => void;
  setSelectedTable: (table: POSTableType | null) => void;
  openReceiptModal: (data: ReceiptDataType) => void;
  closeReceiptModal: () => void;

  // Cart operations
  addToCart: (
    item: any,
    customOptions?: { note?: string; extraPrice?: number; quantity?: number }
  ) => void;
  updateCartItemQuantity: (menuItemId: string, delta: number) => void;
  updateCartItemNote: (menuItemId: string, note: string) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;

  // Operations
  selectTable: (table: POSTableType) => void;
  submitOrder: (params: SubmitOrderParams) => Promise<boolean>;
  removeBackendOrderItem: (params: RemoveOrderItemParams) => Promise<boolean>;
  updateOrderStatusAPI: (params: UpdateOrderStatusParams) => Promise<boolean>;
  cancelOrderAPI: (params: CancelOrderParams) => Promise<boolean>;
  processPaymentAPI: (params: ProcessPaymentParams) => Promise<boolean>;
  transferTableAPI: (params: TransferTableParams) => Promise<boolean>;
}

export const usePOSStore = create<POSState>((set, get) => ({
  tables: [],
  zones: [],
  categories: [],
  menuItems: [],
  allOrders: [],
  activeOrders: [],
  currencies: [],
  customers: [],

  selectedTable: null,
  selectedCustomer: null,
  selectedZoneId: IEntityStatus.all,
  selectedCategoryId: IEntityStatus.all,
  menuSearchKeyword: "",
  viewMode: IPosViewMode.table,

  currentOrder: null,
  cart: [],
  discount: 0,
  orderNote: "",

  loading: false,
  actionLoading: false,
  paymentModalOpen: false,
  moveTableModalOpen: false,
  customerModalOpen: false,
  shiftModalOpen: false,
  shiftModalMode: 'open',
  receiptModalOpen: false,
  receiptData: null,
  currentShift: null,
  lastClosedShift: null,
  autoRefreshEnabled: true,
  setAutoRefreshEnabled: (enabled) => set({ autoRefreshEnabled: enabled }),
  refreshMasterData: null,
  silentRefresh: null,

  setRefreshMasterData: (fn) => set({ refreshMasterData: fn }),
  setSilentRefresh: (fn) => set({ silentRefresh: fn }),
  setLoading: (loading) => set({ loading }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedZoneId: (zoneId) => set({ selectedZoneId: zoneId }),
  setSelectedCategoryId: (catId) => set({ selectedCategoryId: catId }),
  setMenuSearchKeyword: (keyword) => set({ menuSearchKeyword: keyword }),
  setDiscount: (discount) => set({ discount }),
  setOrderNote: (note) => set({ orderNote: note }),
  setPaymentModalOpen: (open) => set({ paymentModalOpen: open }),
  setMoveTableModalOpen: (open) => set({ moveTableModalOpen: open }),
  setCustomerModalOpen: (open) => set({ customerModalOpen: open }),
  setShiftModalOpen: (open, mode) => {
    let targetMode = mode;
    if (!targetMode) {
      if (get().currentShift) {
        targetMode = "manage";
      } else {
        targetMode = "open";
      }
    }
    set({ shiftModalOpen: open, shiftModalMode: targetMode });
  },
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setCustomers: (customers) => set({ customers }),
  setSelectedTable: (table) => set({ selectedTable: table }),
  openReceiptModal: (data) => set({ receiptModalOpen: true, receiptData: data }),
  closeReceiptModal: () => set({ receiptModalOpen: false, receiptData: null }),

  loadStoredShift: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("pos_current_shift");
      if (stored) {
        const parsed = JSON.parse(stored) as ShiftType;
        if (parsed && parsed.status === "open") {
          set({ currentShift: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load stored shift", e);
    }
  },

  openShift: ({ startingFloat, staffId, staffName }) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = String(Math.floor(Math.random() * 900) + 100);
    const shiftNumber = `SH-${dateStr}-${randomSuffix}`;

    const newShift: ShiftType = {
      _id: `shift_${Date.now()}`,
      shiftNumber,
      staffId: staffId || "staff",
      staffName: staffName || "Staff",
      openedAt: now.toISOString(),
      closedAt: null,
      status: "open",
      startingFloat: Number(startingFloat) || 0,
      cashTransactions: [],
      salesSummary: {
        totalSales: 0,
        cashSales: 0,
        qrSales: 0,
        cardSales: 0,
        totalOrders: 0,
      },
    };

    set({
      currentShift: newShift,
      shiftModalOpen: false,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("pos_current_shift", JSON.stringify(newShift));
    }

    ToastService.success(`Shift ${shiftNumber} opened successfully!`);
  },

  addCashTransaction: ({ type, amount, reason }) => {
    const { currentShift } = get();
    if (!currentShift) {
      ToastService.error("No active shift open");
      return;
    }

    const tx: CashTransactionType = {
      _id: `tx_${Date.now()}`,
      type,
      amount: Number(amount) || 0,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedTransactions = [...currentShift.cashTransactions, tx];
    const updatedShift: ShiftType = {
      ...currentShift,
      cashTransactions: updatedTransactions,
    };

    set({ currentShift: updatedShift });

    if (typeof window !== "undefined") {
      localStorage.setItem("pos_current_shift", JSON.stringify(updatedShift));
    }

    if (type === "cash_in") {
      ToastService.success(`Added +${tx.amount.toLocaleString()} ₭ into drawer`);
    } else {
      ToastService.success(`Paid out -${tx.amount.toLocaleString()} ₭ from drawer`);
    }
  },

  closeShift: ({ actualCash, closingNotes }) => {
    const { currentShift } = get();
    if (!currentShift) {
      ToastService.error("No active shift open");
      return null;
    }

    const startingFloat = Number(currentShift.startingFloat) || 0;
    const cashSales = Number(currentShift.salesSummary?.cashSales) || 0;

    let totalCashIn = 0;
    let totalCashOut = 0;
    for (const tx of currentShift.cashTransactions) {
      if (tx.type === "cash_in") {
        totalCashIn += tx.amount;
      } else {
        totalCashOut += tx.amount;
      }
    }

    const expectedCash = startingFloat + cashSales + totalCashIn - totalCashOut;
    const difference = actualCash - expectedCash;

    const closedShift: ShiftType = {
      ...currentShift,
      closedAt: new Date().toISOString(),
      status: "closed",
      actualCash,
      expectedCash,
      difference,
      closingNotes: closingNotes?.trim() || "",
    };

    if (typeof window !== "undefined") {
      try {
        const historyJson = localStorage.getItem("pos_shift_history");
        const history: ShiftType[] = historyJson ? JSON.parse(historyJson) : [];
        history.unshift(closedShift);
        localStorage.setItem("pos_shift_history", JSON.stringify(history.slice(0, 50)));
        localStorage.removeItem("pos_current_shift");
      } catch (e) {
        console.error("Failed to save shift history", e);
      }
    }

    set({
      currentShift: null,
      lastClosedShift: closedShift,
      shiftModalOpen: false,
    });

    ToastService.success(`Shift ${closedShift.shiftNumber} closed successfully!`);
    return closedShift;
  },

  setMasterData: (data) => {
    const { rawTables, zones, categories, menuItems, allOrders, currencies } = data;

    const activeOrders = allOrders.filter(
      (o) => o.status !== IPosOrderStatus.paid && o.status !== IPosOrderStatus.cancelled
    );

    const zoneMap = new Map<string, string>();
    for (const z of zones) {
      zoneMap.set(z._id, z.name);
    }

    const activeOrderByTableMap = new Map<string, OrderType>();
    for (const ord of activeOrders) {
      if (!activeOrderByTableMap.has(ord.tableId)) {
        activeOrderByTableMap.set(ord.tableId, ord);
      }
    }

    const enhancedTables: POSTableType[] = rawTables.map((t) => {
      const foundOrder = activeOrderByTableMap.get(t._id);
      const zoneName = zoneMap.get(t.zoneId) ?? "";
      const tableStatus = foundOrder ? IPosTableStatus.occupied : t.status;
      return {
        ...t,
        zoneName,
        status: tableStatus,
        activeOrder: foundOrder,
      };
    });

    const currentSelected = get().selectedTable;
    let updatedSelectedTable = currentSelected;
    let updatedCurrentOrder = get().currentOrder;
    if (currentSelected) {
      const refreshedTable = enhancedTables.find((t) => t._id === currentSelected._id);
      if (refreshedTable) {
        updatedSelectedTable = refreshedTable;
        updatedCurrentOrder = refreshedTable.activeOrder ?? null;
      } else {
        const found = activeOrderByTableMap.get(currentSelected._id);
        updatedCurrentOrder = found ?? null;
      }
    }

    set({
      tables: enhancedTables,
      selectedTable: updatedSelectedTable,
      zones,
      categories,
      menuItems,
      allOrders,
      activeOrders,
      currencies,
      customers: data.customers ?? get().customers,
      currentOrder: updatedCurrentOrder,
    });
  },

  addToCart: (item, customOptions) => {
    const { cart } = get();
    const qtyToAdd = customOptions?.quantity || 1;
    const extraPrice = customOptions?.extraPrice || 0;
    const note = customOptions?.note || "";
    const unitPrice = Number(item.price) + extraPrice;

    const existingIndex = cart.findIndex(
      (c) => c.menuItemId === item._id && (c.note || "") === note && c.unitPrice === unitPrice
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const existing = updatedCart[existingIndex];
      const newQty = existing.quantity + qtyToAdd;
      updatedCart[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPrice: newQty * existing.unitPrice,
      };
      set({ cart: updatedCart });
    } else {
      const newItem: CartItemType = {
        menuItemId: item._id,
        menuItemName: item.name,
        unitPrice: unitPrice,
        quantity: qtyToAdd,
        totalPrice: unitPrice * qtyToAdd,
        photo: item.photo,
        categoryId: item.categoryId,
        note: note,
      };
      set({ cart: [...cart, newItem] });
    }
  },

  updateCartItemQuantity: (menuItemId, delta) => {
    const { cart } = get();
    const updated = cart
      .map((c) => {
        if (c.menuItemId === menuItemId) {
          const newQty = c.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...c,
            quantity: newQty,
            totalPrice: newQty * c.unitPrice,
          };
        }
        return c;
      })
      .filter((c): c is CartItemType => c !== null);

    set({ cart: updated });
  },

  updateCartItemNote: (menuItemId, note) => {
    const { cart } = get();
    const updated = cart.map((c) => {
      if (c.menuItemId === menuItemId) {
        return { ...c, note };
      }
      return c;
    });
    set({ cart: updated });
  },

  removeFromCart: (menuItemId) => {
    const { cart } = get();
    set({ cart: cart.filter((c) => c.menuItemId !== menuItemId) });
  },

  clearCart: () => {
    set({ cart: [], discount: 0, orderNote: "" });
  },

  selectTable: (table: POSTableType) => {
    set({
      selectedTable: table,
      currentOrder: table.activeOrder ?? null,
      cart: [],
      discount: table.activeOrder?.discount ?? 0,
      orderNote: "",
      viewMode: IPosViewMode.order,
    });
  },

  submitOrder: async ({ mutations, staffId }) => {
    const { selectedTable, currentOrder, cart, discount, orderNote, selectedCustomer, silentRefresh } = get();

    if (!selectedTable) {
      ToastService.error("Please select a table first");
      return false;
    }

    if (cart.length === 0) {
      ToastService.error("Cart is empty");
      return false;
    }

    try {
      set({ actionLoading: true });
      let orderId = currentOrder?._id;

      // 1. Create order if table doesn't have an active order
      if (!orderId) {
        const customerTag = selectedCustomer
          ? `[Customer: ${selectedCustomer.firstName || ""} ${selectedCustomer.lastName || ""}${selectedCustomer.phoneNumber ? ` • ${selectedCustomer.phoneNumber}` : ""}]`.trim()
          : "";
        const finalNote = customerTag ? (orderNote ? `${customerTag} | ${orderNote}` : customerTag) : orderNote;

        const createRes = await mutations.createOrderMutation({
          variables: {
            input: {
              tableId: selectedTable._id,
              staffId: staffId || "",
              note: finalNote,
              discount: Number(discount) || 0,
            },
          },
        });

        const createdOrder = createRes.data?.createOrder?.order;
        if (!createdOrder) {
          throw new Error("Failed to create order");
        }
        orderId = createdOrder._id;

        // Update table status to occupied
        if (mutations.updateTableMutation) {
          await mutations.updateTableMutation({
            variables: {
              input: {
                _id: selectedTable._id,
                status: IPosTableStatus.occupied,
              },
            },
          });
        }
      }

      // 2. Add each item from cart to the order
      for (const item of cart) {
        await mutations.addOrderItemMutation({
          variables: {
            input: {
              orderId,
              menuItemId: item.menuItemId,
              menuItemName: item.menuItemName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              note: item.note ?? "",
            },
          },
        });
      }

      ToastService.success("Order sent successfully!");
      set({
        selectedTable: selectedTable
          ? { ...selectedTable, status: IPosTableStatus.occupied }
          : null,
        cart: [],
        actionLoading: false,
      });

      if (silentRefresh) {
        await silentRefresh();
      }

      return true;
    } catch (err: any) {
      set({ actionLoading: false });
      ToastService.error(err.message ?? "Failed to submit order");
      return false;
    }
  },

  removeBackendOrderItem: async ({ orderItemId, mutation }) => {
    const { currentOrder, silentRefresh } = get();
    if (!currentOrder) return false;

    try {
      set({ actionLoading: true });
      await mutation({
        variables: {
          input: {
            orderId: currentOrder._id,
            orderItemId,
          },
        },
      });

      ToastService.success("Item removed from order");
      set({ actionLoading: false });

      if (silentRefresh) {
        await silentRefresh();
      }
      return true;
    } catch (err: any) {
      set({ actionLoading: false });
      ToastService.error(err.message ?? "Failed to remove order item");
      return false;
    }
  },

  updateOrderStatusAPI: async ({ orderId, status, mutation }) => {
    const { silentRefresh } = get();
    try {
      set({ actionLoading: true });
      await mutation({
        variables: {
          input: {
            _id: orderId,
            status,
          },
        },
      });

      ToastService.success(`Order status updated to ${status}`);
      set({ actionLoading: false });
      if (silentRefresh) {
        await silentRefresh();
      }
      return true;
    } catch (err: any) {
      set({ actionLoading: false });
      ToastService.error(err.message ?? "Failed to update order status");
      return false;
    }
  },

  cancelOrderAPI: async ({ orderId, reason, mutations }) => {
    const { selectedTable, silentRefresh } = get();
    try {
      set({ actionLoading: true });
      await mutations.cancelOrderMutation({
        variables: {
          input: {
            _id: orderId,
            reason: reason ?? "Cancelled by staff",
          },
        },
      });

      if (selectedTable && mutations.updateTableMutation) {
        await mutations.updateTableMutation({
          variables: {
            input: {
              _id: selectedTable._id,
              status: IPosTableStatus.available,
            },
          },
        });
      }

      ToastService.success("Order cancelled");
      set({
        selectedTable: null,
        currentOrder: null,
        cart: [],
        viewMode: IPosViewMode.table,
        actionLoading: false,
      });
      if (silentRefresh) {
        await silentRefresh();
      }
      return true;
    } catch (err: any) {
      set({ actionLoading: false });
      ToastService.error(err.message ?? "Failed to cancel order");
      return false;
    }
  },

  processPaymentAPI: async ({ input, mutations }) => {
    const { selectedTable, silentRefresh } = get();
    try {
      set({ actionLoading: true });
      const payRes = await mutations.processPaymentMutation({
        variables: { input },
      });

      const payment = payRes.data?.processPayment?.payment;
      if (!payment) {
        throw new Error("Payment processing failed");
      }

      // Update order status to paid
      await mutations.updateOrderStatusMutation({
        variables: {
          input: {
            _id: input.orderId,
            status: IPosOrderStatus.paid,
          },
        },
      });

      // Update table to available
      if (selectedTable && mutations.updateTableMutation) {
        await mutations.updateTableMutation({
          variables: {
            input: {
              _id: selectedTable._id,
              status: IPosTableStatus.available,
            },
          },
        });
      }

      // Update active shift sales if shift is open
      const { currentShift } = get();
      if (currentShift && currentShift.status === "open") {
        const orderTotal = selectedTable?.activeOrder ? Number(selectedTable.activeOrder.total) || 0 : input.amount;
        const currentSales = currentShift.salesSummary || {
          totalSales: 0,
          cashSales: 0,
          qrSales: 0,
          cardSales: 0,
          totalOrders: 0,
        };

        let newCashSales = currentSales.cashSales;
        let newQrSales = currentSales.qrSales;
        let newCardSales = currentSales.cardSales;

        if (input.method === "cash") {
          newCashSales += orderTotal;
        } else if (input.method === "card") {
          newCardSales += orderTotal;
        } else {
          newQrSales += orderTotal;
        }

        const updatedSales: ShiftSalesSummaryType = {
          totalSales: currentSales.totalSales + orderTotal,
          cashSales: newCashSales,
          qrSales: newQrSales,
          cardSales: newCardSales,
          totalOrders: currentSales.totalOrders + 1,
        };

        const updatedShift: ShiftType = {
          ...currentShift,
          salesSummary: updatedSales,
        };

        set({ currentShift: updatedShift });
        if (typeof window !== "undefined") {
          localStorage.setItem("pos_current_shift", JSON.stringify(updatedShift));
        }
      }

      ToastService.success(
        `Payment successful! Change: ${payment.change.toLocaleString()}`
      );

      set({
        selectedTable: null,
        paymentModalOpen: false,
        currentOrder: null,
        cart: [],
        viewMode: IPosViewMode.table,
        actionLoading: false,
      });

      if (silentRefresh) {
        await silentRefresh();
      }
      return true;
    } catch (err: any) {
      set({ actionLoading: false });
      ToastService.error(err.message ?? "Payment failed");
      return false;
    }
  },

  transferTableAPI: async ({ currentTable, targetTable, currentOrder, mutations }) => {
    try {
      set({ actionLoading: true });

      const res = await mutations.transferTableMutation({
        variables: {
          input: {
            orderId: currentOrder._id,
            fromTableId: currentTable._id,
            toTableId: targetTable._id,
          },
        },
      });

      const returnedOrder = res.data?.transferTable?.order;
      const updatedOrder = {
        ...currentOrder,
        ...(returnedOrder ?? {}),
        tableId: targetTable._id,
      };

      ToastService.success(`Moved order from ${currentTable.number} to ${targetTable.number} successfully!`);

      // Switch selection to the target table
      const updatedTargetTable: POSTableType = {
        ...targetTable,
        status: IPosTableStatus.occupied,
        activeOrder: updatedOrder,
      };

      set({
        selectedTable: updatedTargetTable,
        currentOrder: updatedOrder,
        moveTableModalOpen: false,
        actionLoading: false,
      });

      // Silent refresh tables & orders
      const { silentRefresh: sr } = get();
      if (sr) {
        await sr();
      }

      return true;
    } catch (err: any) {
      set({ actionLoading: false });
      ToastService.error(err.message ?? "Failed to move table");
      const { silentRefresh: sr2 } = get();
      if (sr2) {
        await sr2();
      }
      return false;
    }
  },
}));
