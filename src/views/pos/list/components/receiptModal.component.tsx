"use client";

import React from "react";
import { usePOSStore } from "../../store/posStore";
import { POSListProps } from "../../type/posType";

const ReceiptModalComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { dictionary: dic } = props;
  const { receiptModalOpen, receiptData, closeReceiptModal } = usePOSStore();

  if (!receiptModalOpen || !receiptData) return null;

  const isReceipt = receiptData.type === "receipt";

  const handlePrint = () => {
    if (!receiptData) return;

    // Use an isolated iframe for reliable thermal receipt printing without CSS clipping
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const itemsHtml = receiptData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 4px 0; text-align: left; vertical-align: top;">
            <div style="font-weight: 600; font-size: 11px;">${item.name}</div>
            ${item.note ? `<div style="font-size: 10px; color: #555; font-style: italic;">* ${item.note}</div>` : ""}
          </td>
          <td style="padding: 4px 0; text-align: center; vertical-align: top; font-size: 11px;">${item.quantity}</td>
          <td style="padding: 4px 0; text-align: right; vertical-align: top; font-size: 11px;">${item.unitPrice.toLocaleString()}</td>
          <td style="padding: 4px 0; text-align: right; font-weight: bold; vertical-align: top; font-size: 11px;">${item.totalPrice.toLocaleString()}</td>
        </tr>
      `
      )
      .join("");

    const paymentDetailsHtml = isReceipt
      ? `
        <div style="border-top: 1px dashed #333; margin-top: 8px; padding-top: 6px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #555;">${dic.posPage?.paymentMethod ?? "Method"}:</span>
            <span style="font-weight: bold; text-transform: uppercase;">${receiptData.paymentMethod ?? "Cash"}</span>
          </div>
          ${
            receiptData.amountReceived !== undefined
              ? `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                  <span style="color: #555;">${dic.posPage?.amountReceived ?? "Received"}:</span>
                  <span>${receiptData.amountReceived.toLocaleString()} ₭</span>
                </div>`
              : ""
          }
          ${
            receiptData.change !== undefined
              ? `<div style="display: flex; justify-content: space-between; font-weight: bold; color: #000;">
                  <span>${dic.posPage?.change ?? "Change"}:</span>
                  <span>${receiptData.change.toLocaleString()} ₭</span>
                </div>`
              : ""
          }
        </div>
      `
      : "";

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${isReceipt ? "Receipt" : "Bill"}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 10px;
              width: 72mm;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 11px;
              line-height: 1.35;
              color: #000;
              background: #fff;
              box-sizing: border-box;
            }
            * { box-sizing: border-box; }
            .header { text-align: center; margin-bottom: 8px; }
            .brand { font-size: 14px; font-weight: 900; letter-spacing: 0.5px; }
            .sub { font-size: 10px; color: #444; margin-top: 2px; }
            .badge {
              display: inline-block;
              border: 1px solid #000;
              font-size: 11px;
              font-weight: bold;
              padding: 2px 6px;
              border-radius: 4px;
              margin-top: 5px;
            }
            .divider { border-top: 1px dashed #333; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
            .label { color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 4px; }
            th { border-bottom: 1px solid #000; font-size: 10px; padding: 4px 0; }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              font-weight: 900;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
            .footer { text-align: center; font-size: 10px; color: #555; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">LAO WORLD RESTAURANT</div>
            <div class="sub">Vientiane, Lao PDR • Tel: (+856) 20 5555 5555</div>
            <div class="badge">
              ${isReceipt ? (dic.posPage?.receipt ?? "OFFICIAL RECEIPT") : (dic.posPage?.checkBill ?? "CHECK BILL")}
            </div>
          </div>

          <div class="divider"></div>

          <div class="row">
            <span class="label">${dic.posPage?.table ?? "Table"}:</span>
            <span style="font-weight: bold;">${receiptData.tableNumber}${receiptData.zoneName ? ` (${receiptData.zoneName})` : ""}</span>
          </div>
          <div class="row">
            <span class="label">${dic.orderNumber ?? "Order"}:</span>
            <span style="font-weight: 600;">${receiptData.orderNumber}</span>
          </div>
          <div class="row">
            <span class="label">${dic.posPage?.date ?? "Date"}:</span>
            <span>${receiptData.date}</span>
          </div>
          ${
            receiptData.staffName
              ? `<div class="row">
                  <span class="label">${dic.posPage?.cashier ?? "Cashier"}:</span>
                  <span>${receiptData.staffName}</span>
                </div>`
              : ""
          }

          <div class="divider"></div>

          <table>
            <thead>
              <tr>
                <th style="text-align: left; width: 48%;">ITEM</th>
                <th style="text-align: center; width: 14%;">QTY</th>
                <th style="text-align: right; width: 18%;">PRICE</th>
                <th style="text-align: right; width: 20%;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="divider"></div>

          <div class="row">
            <span class="label">${dic.posPage?.subtotal ?? "Subtotal"}:</span>
            <span>${receiptData.subTotal.toLocaleString()} ₭</span>
          </div>
          ${
            receiptData.discount > 0
              ? `<div class="row" style="color: #c00;">
                  <span>${dic.posPage?.discount ?? "Discount"}:</span>
                  <span>-${receiptData.discount.toLocaleString()} ₭</span>
                </div>`
              : ""
          }
          <div class="total-row">
            <span>${dic.posPage?.total ?? "TOTAL"}:</span>
            <span>${receiptData.total.toLocaleString()} ₭</span>
          </div>

          ${paymentDetailsHtml}

          <div class="divider"></div>

          <div class="footer">
            <div style="font-weight: bold; font-size: 11px; color: #000; margin-bottom: 2px;">
              ${dic.posPage?.thankYou ?? "Thank you for your visit!"}
            </div>
            <div>Please keep this receipt for verification</div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger print once document renders
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="tabler-receipt text-xl text-[#2F57AB] dark:text-blue-400" />
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">
              {isReceipt
                ? dic.posPage?.receipt ?? "Receipt"
                : dic.posPage?.checkBill ?? "Bill / Check Out"}
            </h3>
          </div>
          <button
            onClick={closeReceiptModal}
            className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs transition-all"
          >
            ✕
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="overflow-y-auto p-4 sm:p-5 flex-1 bg-gray-100/60 dark:bg-gray-900/50">
          <div
            id="printable-pos-receipt"
            className="bg-white text-gray-900 p-5 rounded-xl border border-gray-200 shadow-sm font-mono text-xs space-y-3.5 max-w-[80mm] mx-auto"
          >
            {/* Header Brand */}
            <div className="text-center space-y-1">
              <h2 className="text-base font-black tracking-wider text-gray-900">
                LAO WORLD RESTAURANT
              </h2>
              <p className="text-[10px] text-gray-500 font-sans">
                Vientiane, Lao PDR • Tel: (+856) 20 5555 5555
              </p>
              <div className="inline-block px-2.5 py-0.5 rounded border border-gray-800 text-[11px] font-bold uppercase mt-1">
                {isReceipt
                  ? dic.posPage?.receipt ?? "OFFICIAL RECEIPT"
                  : dic.posPage?.checkBill ?? "CHECK BILL"}
              </div>
            </div>

            {/* Meta Info */}
            <div className="border-t border-dashed border-gray-300 pt-2.5 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {dic.posPage?.table ?? "Table"}:
                </span>
                <span className="font-bold">
                  {receiptData.tableNumber}
                  {receiptData.zoneName ? ` (${receiptData.zoneName})` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {dic.orderNumber ?? "Order"}:
                </span>
                <span className="font-medium">{receiptData.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {dic.posPage?.date ?? "Date"}:
                </span>
                <span>{receiptData.date}</span>
              </div>
              {receiptData.staffName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {dic.posPage?.cashier ?? "Cashier"}:
                  </span>
                  <span>{receiptData.staffName}</span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="border-t border-dashed border-gray-300 pt-2.5 space-y-2">
              <div className="grid grid-cols-12 font-bold text-[10px] text-gray-600 border-b border-gray-200 pb-1">
                <span className="col-span-6">ITEM</span>
                <span className="col-span-2 text-center">QTY</span>
                <span className="col-span-4 text-right">TOTAL</span>
              </div>

              {receiptData.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5 text-[11px]">
                  <div className="grid grid-cols-12 items-baseline">
                    <span className="col-span-6 font-medium break-words leading-tight">
                      {item.name}
                    </span>
                    <span className="col-span-2 text-center text-gray-600">
                      ×{item.quantity}
                    </span>
                    <span className="col-span-4 text-right font-semibold">
                      {item.totalPrice.toLocaleString()} ₭
                    </span>
                  </div>
                  {item.note && (
                    <div className="text-[10px] text-gray-500 italic pl-1">
                      * {item.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Calculation Totals */}
            <div className="border-t border-dashed border-gray-300 pt-2.5 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-600">{dic.posPage?.subtotal ?? "Subtotal"}:</span>
                <span>{receiptData.subTotal.toLocaleString()} ₭</span>
              </div>
              {receiptData.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>{dic.posPage?.discount ?? "Discount"}:</span>
                  <span>-{receiptData.discount.toLocaleString()} ₭</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-gray-800 pt-1 text-gray-900">
                <span>{dic.posPage?.total ?? "TOTAL"}:</span>
                <span>{receiptData.total.toLocaleString()} ₭</span>
              </div>
            </div>

            {/* Payment Details (Only if paid receipt) */}
            {isReceipt && (
              <div className="border-t border-dashed border-gray-300 pt-2 space-y-1 text-[11px] bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {dic.posPage?.paymentMethod ?? "Method"}:
                  </span>
                  <span className="font-bold uppercase">
                    {receiptData.paymentMethod ?? "Cash"}
                  </span>
                </div>
                {receiptData.amountReceived !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {dic.posPage?.amountReceived ?? "Received"}:
                    </span>
                    <span>{receiptData.amountReceived.toLocaleString()} ₭</span>
                  </div>
                )}
                {receiptData.change !== undefined && (
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>{dic.posPage?.change ?? "Change"}:</span>
                    <span>${receiptData.change.toLocaleString()} ₭</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Message */}
            <div className="border-t border-dashed border-gray-300 pt-3 text-center space-y-1">
              <p className="font-semibold text-[11px]">
                {dic.posPage?.thankYou ?? "Thank you for your visit!"}
              </p>
              <p className="text-[10px] text-gray-400 font-sans">
                Please keep this receipt for verification
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeReceiptModal}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {dic.posPage?.close ?? "Close"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-[#2F57AB] hover:bg-[#25468a] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <i className="tabler-printer text-base" />
            <span>{dic.posPage?.print ?? "Print"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModalComponent;
