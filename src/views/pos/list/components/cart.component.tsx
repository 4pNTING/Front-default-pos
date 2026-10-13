"use client";

import React, { useState } from "react";
import { usePOSStore, usePOSMutations } from "../../store/posStore";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { POSListProps, IPosOrderStatus, IPosViewMode } from "../../type/posType";

const CartComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  // Var
  const { lang, dictionary: dic } = props;

  const {
    createOrderMutation,
    addOrderItemMutation,
    removeOrderItemMutation,
    cancelOrderMutation,
    updateTableMutation,
  } = usePOSMutations();
  const { data: session } = useSession();

  const {
    selectedTable,
    currentOrder,
    cart,
    discount,
    setDiscount,
    orderNote,
    setOrderNote,
    updateCartItemQuantity,
    updateCartItemNote,
    removeFromCart,
    clearCart,
    submitOrder,
    removeBackendOrderItem,
    cancelOrderAPI,
    setPaymentModalOpen,
    setMoveTableModalOpen,
    openReceiptModal,
    setViewMode,
    actionLoading,
  } = usePOSStore();

  const [activeTab, setActiveTab] = useState<"cart" | "active">("cart");

  // Calculate totals
  const backendSubtotal = Number(currentOrder?.subTotal) || 0;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalSubtotal = backendSubtotal + cartSubtotal;
  const finalDiscount = Number(discount) || 0;
  const grandTotal = Math.max(0, totalSubtotal - finalDiscount);

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    const result = await Swal.fire({
      title: dic.posPage?.confirmCancelTitle ?? "Cancel Order?",
      text: dic.posPage?.confirmCancelText ?? `Are you sure you want to cancel order ${currentOrder.orderNumber}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: dic.posPage?.confirmCancelButton ?? "Yes, Cancel Order",
      cancelButtonText: dic.posPage?.cancel ?? "Cancel",
    });

    if (result.isConfirmed) {
      await cancelOrderAPI({
        orderId: currentOrder._id,
        mutations: { cancelOrderMutation, updateTableMutation },
      });
    }
  };

  const handlePrintBill = () => {
    if (!currentOrder || !selectedTable) return;

    const receiptItems = (currentOrder.items || []).map((i) => ({
      name: i.menuItemName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
      note: i.note,
    }));

    openReceiptModal({
      type: "bill",
      orderNumber: currentOrder.orderNumber,
      tableNumber: selectedTable.number,
      zoneName: selectedTable.zoneName,
      staffName: (session?.user as any)?.username || "admin",
      date: new Date().toLocaleString(),
      items: receiptItems,
      subTotal: currentOrder.subTotal || 0,
      discount: currentOrder.discount || 0,
      total: currentOrder.total || 0,
    });
  };

  const handleRemoveBackendItem = async (orderItemId: string, itemName: string) => {
    const result = await Swal.fire({
      title: "Remove Item?",
      text: `Remove ${itemName} from active order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove",
      cancelButtonText: dic.posPage?.cancel ?? "Cancel",
    });

    if (result.isConfirmed) {
      await removeBackendOrderItem({
        orderItemId,
        mutation: removeOrderItemMutation,
      });
    }
  };

  const handleSubmitOrder = async () => {
    const success = await submitOrder({
      mutations: {
        createOrderMutation,
        addOrderItemMutation,
        updateTableMutation,
      },
      staffId: session?.user?._id,
    });
    if (success) {
      setActiveTab("active");
    }
  };

  if (!selectedTable) {
    return (
      <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center text-gray-400">
        <i className="tabler-armchair text-5xl mb-3 text-gray-300 dark:text-gray-600" />
        <h4 className="font-semibold text-gray-600 dark:text-gray-300 text-base mb-1">
          {dic.posPage?.noTableSelected ?? "No Table Selected"}
        </h4>
        <p className="text-xs text-gray-400 max-w-[200px] mb-4">
          {dic.posPage?.emptyCartSub ?? "Please select a table to start an order."}
        </p>
        <button
          onClick={() => setViewMode(IPosViewMode.table)}
          className="px-4 py-2 bg-[#2F57AB] text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-[#25468a] transition-all"
        >
          {dic.posPage?.tablesTab ?? "View Tables"}
        </button>
      </div>
    );
  }

  const backendItems = currentOrder?.items ?? [];

  return (
    <div className="w-full md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-lg z-20">
      {/* Header: Table Info & Status */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#2F57AB] text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {selectedTable.number}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                {dic.posPage?.table ?? "Table"} {selectedTable.number}
              </h3>
              <span className="text-xs text-gray-400 block">
                {selectedTable.zoneName ?? "Standard Zone"} • Cap: {selectedTable.capacity}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {currentOrder && (
              <button
                onClick={() => setMoveTableModalOpen(true)}
                className="text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 font-semibold flex items-center gap-1 transition-all"
                title={dic.posPage?.moveTable ?? "Move Table"}
              >
                <i className="tabler-arrows-exchange text-sm" />
                <span>{dic.posPage?.moveTable ?? "Move Table"}</span>
              </button>
            )}

            <button
              onClick={() => setViewMode(IPosViewMode.table)}
              className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
            >
              {dic.posPage?.switchTable ?? "Switch Table"}
            </button>
          </div>
        </div>

        {/* Current Order Status Bar */}
        {currentOrder && (
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between text-xs">
            <span className="font-mono text-gray-600 dark:text-gray-300 font-semibold">
              {currentOrder.orderNumber}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-semibold capitalize ${
                currentOrder.status === IPosOrderStatus.served
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                  : currentOrder.status === IPosOrderStatus.preparing || currentOrder.status === "cooking"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  : currentOrder.status === IPosOrderStatus.confirmed
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {currentOrder.status === IPosOrderStatus.preparing || currentOrder.status === "cooking"
                ? dic.posPage?.statusPreparing ?? "Cooking"
                : currentOrder.status === IPosOrderStatus.confirmed
                ? dic.posPage?.statusConfirmed ?? "Confirmed"
                : currentOrder.status === IPosOrderStatus.served
                ? dic.posPage?.statusServed ?? "Served"
                : currentOrder.status === IPosOrderStatus.pending
                ? dic.posPage?.statusPending ?? "Pending"
                : currentOrder.status}
            </span>
          </div>
        )}

        {/* Tab switch between new cart items and already ordered items */}
        {backendItems.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mt-3 bg-gray-200 dark:bg-gray-700/60 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab("cart")}
              className={`py-1 rounded-md transition-all ${
                activeTab === "cart"
                  ? "bg-white dark:bg-gray-800 text-[#2F57AB] dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {dic.posPage?.newItems ?? "New Items"} ({cart.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`py-1 rounded-md transition-all ${
                activeTab === "active"
                  ? "bg-white dark:bg-gray-800 text-[#2F57AB] dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {dic.posPage?.orderedItems ?? "Ordered"} ({backendItems.length})
            </button>
          </div>
        )}
      </div>

      {/* Items Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === "cart" || backendItems.length === 0 ? (
          /* New Cart Items */
          cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-xs text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-2.5 text-gray-400 dark:text-gray-500">
                <i className="tabler-shopping-bag text-2xl" />
              </div>
              <p className="font-medium text-gray-600 dark:text-gray-300">{dic.posPage?.emptyCart ?? "No new items in cart."}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {dic.posPage?.emptyCartSub ?? "Click any menu item from the catalog to add."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.menuItemId}
                  className="bg-gray-50 dark:bg-gray-750 p-2.5 rounded-lg border border-gray-200/80 dark:border-gray-700 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                        {item.menuItemName}
                      </h4>
                      <span className="text-[11px] text-gray-500">
                        {item.unitPrice.toLocaleString()} ₭ × {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {item.totalPrice.toLocaleString()} ₭
                      </span>
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="text-gray-400 hover:text-rose-500 p-0.5"
                      >
                        <i className="tabler-trash text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Note */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                    <input
                      type="text"
                      placeholder={dic.posPage?.notePlaceholder ?? "Add note (e.g. less spicy)..."}
                      value={item.note ?? ""}
                      onChange={(e) =>
                        updateCartItemNote(item.menuItemId, e.target.value)
                      }
                      className="flex-1 text-[11px] px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded outline-none"
                    />

                    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 px-1 py-0.5">
                      <button
                        onClick={() =>
                          updateCartItemQuantity(item.menuItemId, -1)
                        }
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartItemQuantity(item.menuItemId, 1)
                        }
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Already Ordered Items on Backend */
          <div className="space-y-2.5">
            {backendItems.map((item) => (
              <div
                key={item._id}
                className="bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-200/60 dark:border-blue-900/40 flex items-start justify-between"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                      {item.menuItemName}
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-500 ml-3 block">
                    {item.unitPrice.toLocaleString()} ₭ × {item.quantity}
                  </span>
                  {item.note && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 italic ml-3 block">
                      Note: {item.note}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-900 dark:text-white">
                    {item.totalPrice.toLocaleString()} ₭
                  </span>
                  {item._id && (
                    <button
                      onClick={() =>
                        handleRemoveBackendItem(item._id!, item.menuItemName)
                      }
                      className="text-gray-400 hover:text-rose-500 p-0.5"
                      title="Remove item"
                    >
                      <i className="tabler-trash text-sm" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary and Action Buttons */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/60 space-y-3">
        {/* Order note input */}
        <input
          type="text"
          placeholder={dic.posPage?.notePlaceholder ?? "Add note (e.g. less spicy)..."}
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          className="w-full text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB]"
        />

        {/* Calculations */}
        <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex justify-between">
            <span>{dic.posPage?.subtotal ?? "Subtotal"}</span>
            <span>{totalSubtotal.toLocaleString()} ₭</span>
          </div>

          <div className="flex items-center justify-between">
            <span>{dic.posPage?.discount ?? "Discount"} (₭)</span>
            <input
              type="number"
              min="0"
              value={discount === 0 ? "" : discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              placeholder="0"
              className="w-24 text-right text-xs px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded outline-none"
            />
          </div>

          <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>{dic.posPage?.total ?? "Total"}</span>
            <span className="text-[#2F57AB] dark:text-blue-400 text-base">
              {grandTotal.toLocaleString()} ₭
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Send Order Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={cart.length === 0 || actionLoading}
            className="col-span-2 py-2.5 px-3 bg-[#2F57AB] hover:bg-[#25468a] text-white text-xs font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <i className="tabler-send text-sm" />
            <span>
              {actionLoading
                ? dic.posPage?.sending ?? "Sending..."
                : currentOrder
                ? `${dic.posPage?.addToOrder ?? "Add to Order"} (${cart.length})`
                : `${dic.posPage?.sendNewOrder ?? "Send New Order"} (${cart.length})`}
            </span>
          </button>

          {/* Print Check Bill Button */}
          {currentOrder && (
            <button
              onClick={handlePrintBill}
              className="py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-600 transition-all flex items-center justify-center gap-1.5"
              title={dic.posPage?.printBill ?? "Print Bill"}
            >
              <i className="tabler-printer text-sm" />
              <span>{dic.posPage?.printBill ?? "Print Bill"}</span>
            </button>
          )}

          {/* Pay / Bill Button */}
          {currentOrder && (
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <i className="tabler-receipt-2 text-sm" />
              <span>{dic.posPage?.billAndPay ?? "Bill & Pay"}</span>
            </button>
          )}

          {/* Cancel Order Button */}
          {currentOrder && (
            <button
              onClick={handleCancelOrder}
              disabled={actionLoading}
              className="col-span-2 py-1.5 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-800 transition-all flex items-center justify-center gap-1.5"
            >
              <i className="tabler-ban text-sm" />
              <span>{dic.posPage?.cancelOrder ?? "Cancel Order"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
