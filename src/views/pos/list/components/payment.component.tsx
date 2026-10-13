"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { usePOSStore, usePOSMutations } from "../../store/posStore";
import { POSListProps, IPosPaymentMethod } from "../../type/posType";
import { ToastService } from "@/utils/toastService";

const PaymentComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  // Var
  const { lang, dictionary: dic } = props;
  const { data: session } = useSession();

  const {
    processPaymentMutation,
    updateOrderStatusMutation,
    updateTableMutation,
  } = usePOSMutations();
  const {
    currentOrder,
    selectedTable,
    currencies,
    paymentModalOpen,
    setPaymentModalOpen,
    processPaymentAPI,
    openReceiptModal,
    actionLoading,
  } = usePOSStore();

  const [method, setMethod] = useState<IPosPaymentMethod>(IPosPaymentMethod.cash);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>("");
  const [tenderAmount, setTenderAmount] = useState<string>("");

  if (!paymentModalOpen || !currentOrder) return null;

  const totalAmount = currentOrder.total || 0;
  const currentCurrencyId =
    selectedCurrencyId || (currencies.length > 0 ? currencies[0]._id : "");

  const tenderNumber = Number(tenderAmount) || totalAmount;
  const changeAmount = Math.max(0, tenderNumber - totalAmount);

  const handleQuickCash = (amount: number) => {
    setTenderAmount(String(amount));
  };

  const handlePay = async () => {
    if (!currentCurrencyId) {
      ToastService.warning(dic.posPage?.selectCurrencyAlert ?? "Please select a currency");
      return;
    }

    if (tenderNumber < totalAmount && method === IPosPaymentMethod.cash) {
      ToastService.warning(dic.posPage?.insufficientTenderAlert ?? "Received amount is less than total bill!");
      return;
    }

    // Keep snapshot of order and table before store cleans them
    const receiptOrder = { ...currentOrder };
    const receiptTable = selectedTable ? { ...selectedTable } : null;

    const success = await processPaymentAPI({
      input: {
        orderId: currentOrder._id,
        currencyId: currentCurrencyId,
        method,
        amount: tenderNumber,
      },
      mutations: {
        processPaymentMutation,
        updateOrderStatusMutation,
        updateTableMutation,
      },
    });

    if (success && receiptOrder && receiptTable) {
      const receiptItems = (receiptOrder.items || []).map((i) => ({
        name: i.menuItemName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
        note: i.note,
      }));

      openReceiptModal({
        type: "receipt",
        orderNumber: receiptOrder.orderNumber,
        tableNumber: receiptTable.number,
        zoneName: receiptTable.zoneName,
        staffName: (session?.user as any)?.username || (session?.user as any)?.name || "admin",
        date: new Date().toLocaleString(),
        items: receiptItems,
        subTotal: receiptOrder.subTotal || 0,
        discount: receiptOrder.discount || 0,
        total: receiptOrder.total || 0,
        paymentMethod: method,
        amountReceived: tenderNumber,
        change: changeAmount,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2F57AB] to-[#1E3A8A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-lg">
              <i className="tabler-receipt-2" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{dic.posPage?.settlementAndPayment ?? "Settlement & Payment"}</h3>
              <p className="text-xs text-blue-200">
                {dic.posPage?.table ?? "Table"} {selectedTable?.number} • {currentOrder.orderNumber}
              </p>
            </div>
          </div>

          <button
            onClick={() => setPaymentModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Bill Summary Box */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                {dic.posPage?.totalAmountDue ?? "Total Amount Due"}
              </span>
              <div className="text-2xl font-black text-[#2F57AB] dark:text-blue-400 mt-0.5">
                {totalAmount.toLocaleString()} ₭
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>{dic.posPage?.subtotal ?? "Subtotal"}: {(currentOrder.subTotal || 0).toLocaleString()} ₭</div>
              <div>{dic.posPage?.discount ?? "Discount"}: {(currentOrder.discount || 0).toLocaleString()} ₭</div>
              <div>{dic.posPage?.items ?? "Items"}: {currentOrder.items?.length || 0} {dic.posPage?.items ?? "items"}</div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              {dic.posPage?.paymentMethod ?? "Payment Method"}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: IPosPaymentMethod.cash, label: dic.posPage?.cash ?? "Cash", icon: "tabler-cash" },
                { id: IPosPaymentMethod.qr, label: dic.posPage?.qrTransfer ?? "QR / Transfer", icon: "tabler-qrcode" },
                { id: IPosPaymentMethod.card, label: dic.posPage?.creditCard ?? "Credit Card", icon: "tabler-credit-card" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    method === m.id
                      ? "border-[#2F57AB] bg-blue-50/50 dark:bg-blue-950/40 text-[#2F57AB] dark:text-blue-400 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <i className={`${m.icon} text-xl`} />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selector */}
          {currencies.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                {dic.posPage?.currency ?? "Currency"}
              </label>
              <select
                value={currentCurrencyId}
                onChange={(e) => setSelectedCurrencyId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB]"
              >
                {currencies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cash Tender & Quick Buttons */}
          {method === IPosPaymentMethod.cash && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
                  {dic.posPage?.amountReceived ?? "Amount Received (₭)"}
                </label>
                <input
                  type="number"
                  value={tenderAmount}
                  onChange={(e) => setTenderAmount(e.target.value)}
                  placeholder={totalAmount.toString()}
                  className="w-full text-lg font-bold px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB]"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleQuickCash(totalAmount)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200"
                >
                  {dic.posPage?.exact ?? "Exact"} ({totalAmount.toLocaleString()})
                </button>
                {[50000, 100000, 200000, 500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickCash(amt)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200"
                  >
                    {amt.toLocaleString()} ₭
                  </button>
                ))}
              </div>

              {/* Change Box */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {dic.posPage?.change ?? "Change"}:
                </span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {changeAmount.toLocaleString()} ₭
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setPaymentModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {dic.posPage?.cancel ?? "Cancel"}
          </button>
          <button
            type="button"
            onClick={handlePay}
            disabled={actionLoading}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <i className="tabler-check text-sm" />
            <span>{actionLoading ? dic.posPage?.processing ?? "Processing..." : dic.posPage?.completePayment ?? "Complete Payment"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
