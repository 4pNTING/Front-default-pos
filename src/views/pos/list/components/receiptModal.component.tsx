"use client";

import React, { useState } from "react";
import { usePOSStore } from "../../store/posStore";
import { usePrinterStore } from "../../store/printerStore";
import { POSListProps } from "../../type/posType";
import { ToastService } from "@/utils/toastService";

const ReceiptModalComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { lang, dictionary: dic } = props;
  const isLao = lang === "la";
  const { receiptModalOpen, receiptData, closeReceiptModal } = usePOSStore();
  const { cashierPrinter, printReceiptDirect, openDrawerDirect, setSettingsOpen } = usePrinterStore();

  const [isDirectPrinting, setIsDirectPrinting] = useState(false);
  const [isKickingDrawer, setIsKickingDrawer] = useState(false);

  if (!receiptModalOpen || !receiptData) return null;

  const isReceipt = receiptData.type === "receipt";

  // Browser Print (Iframe fallback)
  const handleBrowserPrint = () => {
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

    let paymentDetailsHtml = "";
    if (isReceipt) {
      let receivedHtml = "";
      if (receiptData.amountReceived !== undefined) {
        receivedHtml = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #555;">${dic.posPage?.amountReceived ?? "Received"}:</span>
            <span>${receiptData.amountReceived.toLocaleString()} ₭</span>
          </div>`;
      }

      let changeHtml = "";
      if (receiptData.change !== undefined) {
        changeHtml = `
          <div style="display: flex; justify-content: space-between; font-weight: bold; color: #000;">
            <span>${dic.posPage?.change ?? "Change"}:</span>
            <span>${receiptData.change.toLocaleString()} ₭</span>
          </div>`;
      }

      paymentDetailsHtml = `
        <div style="border-top: 1px dashed #333; margin-top: 8px; padding-top: 6px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #555;">${dic.posPage?.paymentMethod ?? "Method"}:</span>
            <span style="font-weight: bold; text-transform: uppercase;">${receiptData.paymentMethod ?? "Cash"}</span>
          </div>
          ${receivedHtml}
          ${changeHtml}
        </div>
      `;
    }

    let customerHtml = "";
    if (receiptData.customerName) {
      let custDetails = receiptData.customerName;
      if (receiptData.customerPhone) {
        custDetails += ` (${receiptData.customerPhone})`;
      }
      customerHtml = `
        <div class="row">
          <span class="label">Customer:</span>
          <span>${custDetails}</span>
        </div>
      `;
    }

    let discountHtml = "";
    if (receiptData.discount > 0) {
      discountHtml = `
        <div class="row" style="color: #c00;">
          <span>${dic.posPage?.discount ?? "Discount"}:</span>
          <span>-${receiptData.discount.toLocaleString()} ₭</span>
        </div>
      `;
    }

    let titleBadge = dic.posPage?.checkBill ?? "CHECK BILL";
    if (isReceipt) {
      titleBadge = dic.posPage?.receipt ?? "OFFICIAL RECEIPT";
    }

    let shopName = cashierPrinter.shopName || "LAO WORLD RESTAURANT";
    let shopAddr = cashierPrinter.shopAddress || "Vientiane, Lao PDR";
    let shopPhone = cashierPrinter.shopPhone || "+856 20 5555 9999";

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
            <div class="brand">${shopName}</div>
            <div class="sub">${shopAddr} • Tel: ${shopPhone}</div>
            <div class="badge">${titleBadge}</div>
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
          ${customerHtml}

          <div class="divider"></div>

          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Item</th>
                <th style="text-align: center; width: 32px;">Qty</th>
                <th style="text-align: right; width: 50px;">Price</th>
                <th style="text-align: right; width: 55px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="divider"></div>

          <div class="row">
            <span>${dic.posPage?.subtotal ?? "Subtotal"}:</span>
            <span>${receiptData.subTotal.toLocaleString()} ₭</span>
          </div>
          ${discountHtml}
          <div class="total-row">
            <span>${dic.posPage?.total ?? "TOTAL"}:</span>
            <span>${receiptData.total.toLocaleString()} ₭</span>
          </div>

          ${paymentDetailsHtml}

          <div class="divider"></div>

          <div class="footer">
            <div style="font-weight: bold; font-size: 11px; color: #000; margin-bottom: 2px;">
              ${cashierPrinter.footerText || dic.posPage?.thankYou || "Thank you for your visit!"}
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

      closeReceiptModal();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 250);
  };

  // Smart Print Handler (Direct ESC/POS first if in network mode, with fallback to browser print)
  const handlePrint = async () => {
    if (!receiptData) return;

    if (cashierPrinter.mode === "network" && cashierPrinter.enabled) {
      setIsDirectPrinting(true);
      try {
        const res = await printReceiptDirect(receiptData);
        if (res.success) {
          let successText = "พิมพ์ใบเสร็จตรงเข้าเครื่องพิมพ์สำเร็จ!";
          if (isLao) {
            successText = "ພິມໃບເສร็จກົງເຂົ້າເຄື່ອງພິມສຳເລັດ!";
          }
          ToastService.success(successText);
          closeReceiptModal();
          return;
        } else {
          // Direct print failed: notify and prompt fallback
          let warningText = `ไม่สามารถเชื่อมต่อ ${cashierPrinter.ip}:${cashierPrinter.port} ได้ กำลังเปิดหน้าจอพิมพ์ Browser...`;
          if (isLao) {
            warningText = `ບໍ່ສາມາດເຊື່ອມຕໍ່ ${cashierPrinter.ip}:${cashierPrinter.port} ໄດ້, ກຳລັງເປີດໜ້າຈໍພິມ Browser...`;
          }
          ToastService.warning(warningText);
          handleBrowserPrint();
        }
      } catch (err: any) {
        ToastService.error(err.message || "Print error");
        handleBrowserPrint();
      } finally {
        setIsDirectPrinting(false);
      }
    } else {
      // Standard Browser Print
      handleBrowserPrint();
    }
  };

  const handleKickDrawer = async () => {
    setIsKickingDrawer(true);
    try {
      const res = await openDrawerDirect();
      if (res.success) {
        let msg = isLao ? "ເປີດລີ້ນຊັກສຳເລັດ!" : "เปิดลิ้นชักสำเร็จ!";
        ToastService.success(msg);
      } else {
        let msg = res.error;
        if (!msg) {
          msg = isLao ? "ເປີດລີ້ນຊັກບໍ່ສຳເລັດ" : "เปิดลิ้นชักไม่สำเร็จ";
        }
        ToastService.error(msg);
      }
    } finally {
      setIsKickingDrawer(false);
    }
  };

  // Calculate print button label without nested ternary
  let printButtonLabel = dic.posPage?.print ?? "Print";
  if (cashierPrinter.mode === "network") {
    if (isLao) {
      printButtonLabel = "ພິມກົງ (ESC/POS)";
    } else {
      printButtonLabel = "พิมพ์ตรง (ESC/POS)";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="tabler-receipt text-lg" />
            <h3 className="font-bold text-sm">
              {isReceipt
                ? dic.posPage?.receipt ?? "Official Receipt"
                : dic.posPage?.checkBill ?? "Order Bill"}
            </h3>
          </div>
          <button
            onClick={closeReceiptModal}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-all"
          >
            ✕
          </button>
        </div>

        {/* Paper Preview Area (Simulating 80mm thermal roll) */}
        <div className="p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900/60 flex justify-center">
          <div className="w-[300px] bg-white text-black p-4 rounded-lg shadow-sm border border-gray-300 font-mono text-xs space-y-3">
            {/* Receipt Header */}
            <div className="text-center space-y-1">
              <h2 className="font-black text-sm tracking-wide">
                {cashierPrinter.shopName || "LAO WORLD RESTAURANT"}
              </h2>
              <p className="text-[10px] text-gray-500">
                {cashierPrinter.shopAddress || "Vientiane, Lao PDR"}
              </p>
              <p className="text-[10px] text-gray-500">
                Tel: {cashierPrinter.shopPhone || "(+856) 20 5555 5555"}
              </p>
              <div className="inline-block border border-black font-sans font-bold text-[10px] px-2 py-0.5 rounded mt-1">
                {isReceipt
                  ? dic.posPage?.receipt ?? "OFFICIAL RECEIPT"
                  : dic.posPage?.checkBill ?? "CHECK BILL"}
              </div>
            </div>

            {/* Meta Info */}
            <div className="border-t border-dashed border-gray-300 pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">{dic.posPage?.table ?? "Table"}:</span>
                <span className="font-bold">
                  {receiptData.tableNumber}
                  {receiptData.zoneName ? ` (${receiptData.zoneName})` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{dic.orderNumber ?? "Order"}:</span>
                <span className="font-semibold">{receiptData.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{dic.posPage?.date ?? "Date"}:</span>
                <span>{receiptData.date}</span>
              </div>
              {receiptData.staffName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{dic.posPage?.cashier ?? "Cashier"}:</span>
                  <span>{receiptData.staffName}</span>
                </div>
              )}
              {receiptData.customerName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span>
                    {receiptData.customerName}
                    {receiptData.customerPhone ? ` (${receiptData.customerPhone})` : ""}
                  </span>
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
                    <span>{receiptData.change.toLocaleString()} ₭</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Message */}
            <div className="border-t border-dashed border-gray-300 pt-3 text-center space-y-1">
              <p className="font-semibold text-[11px]">
                {cashierPrinter.footerText || dic.posPage?.thankYou || "Thank you for your visit!"}
              </p>
              <p className="text-[10px] text-gray-400 font-sans">
                Please keep this receipt for verification
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
          {/* Printer Mode Indicator & Setting shortcut */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 transition-all"
            title="Configure thermal printer"
          >
            <i className="tabler-settings text-xs text-gray-400" />
            <span className="hidden sm:inline">
              {cashierPrinter.mode === "network" ? `ESC/POS: ${cashierPrinter.ip}` : "Browser Print"}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                cashierPrinter.mode === "network" ? "bg-emerald-500" : "bg-blue-500"
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            {/* Quick Open Cash Drawer Button */}
            <button
              type="button"
              onClick={handleKickDrawer}
              disabled={isKickingDrawer}
              className="px-2.5 py-2 text-xs font-semibold rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-all flex items-center gap-1"
              title="Kick open cash drawer"
            >
              <i className="tabler-cash text-sm" />
              <span className="hidden md:inline">Drawer</span>
            </button>

            {/* Fallback to Browser Print if in Network Mode */}
            {cashierPrinter.mode === "network" && (
              <button
                type="button"
                onClick={handleBrowserPrint}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center gap-1"
                title="Print via Browser dialog"
              >
                <i className="tabler-browser text-sm" />
                <span className="hidden sm:inline">Browser</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeReceiptModal}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {dic.posPage?.close ?? "Close"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isDirectPrinting}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isDirectPrinting ? (
                <i className="tabler-loader animate-spin text-base" />
              ) : (
                <i className="tabler-printer text-base" />
              )}
              <span>{printButtonLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModalComponent;
