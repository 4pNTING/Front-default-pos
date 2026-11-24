"use client";

import React, { useState } from "react";
import { PrintableReceiptModalData } from "../../type/reportType";
import { usePrinterStore } from "@/views/pos/store/printerStore";
import { ToastService } from "@/utils/toastService";

interface ReportReceiptModalProps {
  receiptData: PrintableReceiptModalData | null;
  onClose: () => void;
  lang: string;
}

export const ReportReceiptModal: React.FC<ReportReceiptModalProps> = ({
  receiptData,
  onClose,
  lang,
}) => {
  const { cashierPrinter, printReceiptDirect } = usePrinterStore();
  const [isDirectPrinting, setIsDirectPrinting] = useState(false);

  if (!receiptData) return null;

  const isLao = lang.startsWith("la");

  // Browser Print (Iframe fallback)
  const handleBrowserPrint = () => {
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
      .map((item) => {
        let noteHtml = "";
        if (item.note) {
          noteHtml = `<div style="font-size: 10px; color: #555; font-style: italic;">* ${item.note}</div>`;
        }
        return `
        <tr>
          <td style="padding: 4px 0; text-align: left; vertical-align: top;">
            <div style="font-weight: 600; font-size: 11px;">${item.name}</div>
            ${noteHtml}
          </td>
          <td style="padding: 4px 0; text-align: center; vertical-align: top; font-size: 11px;">${item.quantity}</td>
          <td style="padding: 4px 0; text-align: right; vertical-align: top; font-size: 11px;">${item.unitPrice.toLocaleString()}</td>
          <td style="padding: 4px 0; text-align: right; font-weight: bold; vertical-align: top; font-size: 11px;">${item.totalPrice.toLocaleString()}</td>
        </tr>
      `;
      })
      .join("");

    let discountHtml = "";
    if (receiptData.discount > 0) {
      discountHtml = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px; color: #dc2626;">
          <span>${isLao ? "ສ່ວນຫຼຸດ" : "Discount"}:</span>
          <span>-${receiptData.discount.toLocaleString()} ₭</span>
        </div>`;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${receiptData.orderNumber}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              width: 72mm;
              margin: 0 auto;
              padding: 12px 6px;
              font-family: 'Courier New', Courier, monospace, 'Noto Sans Lao', sans-serif;
              font-size: 11px;
              line-height: 1.35;
              color: #000;
              background: #fff;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 15px; margin-bottom: 2px;">
            ${cashierPrinter.shopName || "LAO RESTAURANT"}
          </div>
          <div class="center" style="font-size: 10px; color: #444; margin-bottom: 2px;">
            ${cashierPrinter.shopAddress || "Vientiane, Lao PDR"}
          </div>
          <div class="center" style="font-size: 10px; color: #444; margin-bottom: 6px;">
            ${cashierPrinter.shopPhone || "+856 20 5555 9999"}
          </div>

          <div class="divider"></div>

          <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
            <span>${isLao ? "ເລກບິນ" : "Bill #"}: <span class="bold">${receiptData.orderNumber}</span></span>
            <span>${isLao ? "ໂຕະ" : "Table"}: <span class="bold">${receiptData.tableNumber}</span></span>
          </div>
          <div style="font-size: 10px; margin-bottom: 2px;">
            <span>${isLao ? "ວັນທີ" : "Date"}: ${receiptData.date}</span>
          </div>

          <div class="divider"></div>

          <table>
            <thead>
              <tr style="border-bottom: 1px solid #000; font-size: 10px;">
                <th style="text-align: left; padding-bottom: 4px;">${isLao ? "ລາຍການ" : "Item"}</th>
                <th style="text-align: center; padding-bottom: 4px;">${isLao ? "ຈຳນວນ" : "Qty"}</th>
                <th style="text-align: right; padding-bottom: 4px;">${isLao ? "ລາຄາ" : "Price"}</th>
                <th style="text-align: right; padding-bottom: 4px;">${isLao ? "ລວມ" : "Total"}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="divider"></div>

          <div style="font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>${isLao ? "ຍອດລວມ" : "Subtotal"}:</span>
              <span>${receiptData.subTotal.toLocaleString()} ₭</span>
            </div>
            ${discountHtml}
            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 5px; border-top: 1px solid #000; padding-top: 4px;">
              <span>${isLao ? "ຍອດສຸດທິ" : "Grand Total"}:</span>
              <span>${receiptData.total.toLocaleString()} ₭</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="center" style="font-size: 10px; margin-top: 8px;">
            ${cashierPrinter.footerText || "THANK YOU / ຂໍຂອບໃຈທີ່ມາໃຊບໍລິການ"}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  };

  // Direct Network ESC/POS Print
  const handleDirectPrint = async () => {
    if (!cashierPrinter.enabled || cashierPrinter.mode !== "network") {
      handleBrowserPrint();
      return;
    }

    try {
      setIsDirectPrinting(true);
      const printableData = {
        type: "receipt" as const,
        orderNumber: receiptData.orderNumber,
        tableNumber: receiptData.tableNumber,
        zoneName: receiptData.zoneName,
        date: receiptData.date,
        items: receiptData.items,
        subTotal: receiptData.subTotal,
        discount: receiptData.discount,
        total: receiptData.total,
        paymentMethod: receiptData.paymentMethod,
        currencyCode: "LAK",
      };

      const res = await printReceiptDirect(printableData);
      if (res.success) {
        ToastService.success(isLao ? "ສັ່ງພິມບິນສຳເລັດ" : "Receipt sent to printer!");
        onClose();
      } else {
        ToastService.error(res.error || (isLao ? "ພິມບໍ່ສຳເລັດ" : "Direct print failed"));
        handleBrowserPrint();
      }
    } catch (e: any) {
      handleBrowserPrint();
    } finally {
      setIsDirectPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-850 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0A3981] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="tabler-printer text-xl" />
            <h3 className="font-bold text-sm">
              {isLao ? "ຕົວຢ່າງໃບບິນ (Thermal Receipt)" : "Print Receipt"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <i className="tabler-x text-lg" />
          </button>
        </div>

        {/* Receipt Preview Paper */}
        <div className="p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900 flex-1 flex justify-center">
          <div className="w-[72mm] bg-white text-gray-900 p-4 shadow-md font-mono text-xs rounded-sm space-y-2 border border-gray-200">
            {/* Shop Header */}
            <div className="text-center">
              <h2 className="font-bold text-sm tracking-wide">
                {cashierPrinter.shopName || "LAO WORLD RESTAURANT"}
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {cashierPrinter.shopAddress || "Vientiane, Lao PDR"}
              </p>
              <p className="text-[10px] text-gray-500">
                {cashierPrinter.shopPhone || "+856 20 5555 9999"}
              </p>
            </div>

            <div className="border-t border-dashed border-gray-300 my-2" />

            {/* Bill Meta */}
            <div className="text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>{isLao ? "ເລກບິນ" : "Bill #"}:</span>
                <span className="font-bold">{receiptData.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>{isLao ? "ໂຕະ" : "Table"}:</span>
                <span className="font-bold">{receiptData.tableNumber} {receiptData.zoneName ? `(${receiptData.zoneName})` : ""}</span>
              </div>
              <div className="flex justify-between">
                <span>{isLao ? "ວັນທີ" : "Date"}:</span>
                <span>{receiptData.date}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-2" />

            {/* Items */}
            <div className="space-y-1.5 text-[11px]">
              {receiptData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="pr-1 flex-1">
                    <div className="font-semibold">{item.name}</div>
                    {item.note && (
                      <div className="text-[9px] text-gray-500 italic">* {item.note}</div>
                    )}
                    <div className="text-[9px] text-gray-500">
                      {item.quantity} × {item.unitPrice.toLocaleString()} ₭
                    </div>
                  </div>
                  <div className="font-bold shrink-0">
                    {item.totalPrice.toLocaleString()} ₭
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 my-2" />

            {/* Totals */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{isLao ? "ຍອດລວມ" : "Subtotal"}:</span>
                <span>{receiptData.subTotal.toLocaleString()} ₭</span>
              </div>
              {receiptData.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>{isLao ? "ສ່ວນຫຼຸດ" : "Discount"}:</span>
                  <span>-{receiptData.discount.toLocaleString()} ₭</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm border-t border-gray-900 pt-1">
                <span>{isLao ? "ຍອດສຸດທິ" : "Grand Total"}:</span>
                <span>{receiptData.total.toLocaleString()} ₭</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 my-2" />

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-500 pt-1">
              <p>{cashierPrinter.footerText || "THANK YOU / ຂໍຂອບໃຈທີ່ມາໃຊບໍລິການ"}</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-3 bg-white dark:bg-gray-850 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          >
            {isLao ? "ປິດ" : "Close"}
          </button>
          <button
            onClick={handleDirectPrint}
            disabled={isDirectPrinting}
            className="flex-1 py-2 px-3 rounded-xl bg-[#2F57AB] hover:bg-[#25468a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
          >
            <i className={`tabler-printer text-base ${isDirectPrinting ? "animate-spin" : ""}`} />
            <span>{isLao ? "ພິມໃບບິນ" : "Print"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportReceiptModal;
