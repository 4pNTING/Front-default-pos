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

  return {
    createOrderMutation,
    addOrderItemMutation,
    removeOrderItemMutation,
    updateOrderStatusMutation,
    cancelOrderMutation,
    processPaymentMutation,
    updateTableMutation,
    transferTableMutation,
  };
};

interface POSState {
  // Master data
  tables: POSTableType[];
  zones: { _id: string; name: string }[];
  categories: { _id: string; name: string }[];
  menuItems: any[];
  activeOrders: OrderType[];
  currencies: CurrencyType[];

  // Selection & Filters
  selectedTable: POSTableType | null;
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
  receiptModalOpen: boolean;
  receiptData: ReceiptDataType | null;
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: (enabled: boolean) => void;

  // Refresh callbacks registered from posList
  refreshMasterData: (() => Promise<void>) | null;
  setRefreshMasterData: (fn: (() => Promise<void>) | null) => void;
  silentRefresh: (() => Promise<void>) | null;
  setSilentRefresh: (fn: (() => Promise<void>) | null) => void;

  // Basic Setters
  setMasterData: (data: SetMasterDataPayload) => void;
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
  addToCart: (item: any) => void;
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
  activeOrders: [],
  currencies: [],

  selectedTable: null,
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
  receiptModalOpen: false,
  receiptData: null,
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
  setSelectedTable: (table) => set({ selectedTable: table }),
  openReceiptModal: (data) => set({ receiptModalOpen: true, receiptData: data }),
  closeReceiptModal: () => set({ receiptModalOpen: false, receiptData: null }),

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
      activeOrders,
      currencies,
      currentOrder: updatedCurrentOrder,
    });
  },

  addToCart: (item) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((c) => c.menuItemId === item._id);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      const existing = updatedCart[existingIndex];
      const newQty = existing.quantity + 1;
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
        unitPrice: Number(item.price),
        quantity: 1,
        totalPrice: Number(item.price),
        photo: item.photo,
        categoryId: item.categoryId,
        note: "",
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
    const { selectedTable, currentOrder, cart, discount, orderNote, silentRefresh } = get();

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
        const createRes = await mutations.createOrderMutation({
          variables: {
            input: {
              tableId: selectedTable._id,
              staffId: staffId || "",
              note: orderNote,
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
