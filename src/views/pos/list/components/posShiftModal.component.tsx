"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { POSListProps, ShiftType } from "../../type/posType";
import { usePOSStore } from "../../store/posStore";
import { useSession } from "next-auth/react";
import { ToastService } from "@/utils/toastService";

export const PosShiftModalComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { lang, dictionary: dic } = props;
  const { data: session } = useSession();

  const {
    currentShift,
    lastClosedShift,
    shiftModalOpen,
    shiftModalMode,
    setShiftModalOpen,
    openShift,
    addCashTransaction,
    closeShift,
  } = usePOSStore();

  // Open Shift Form State
  const [startingFloatInput, setStartingFloatInput] = useState("500000");

  // Cash In / Cash Out State
  const [cashType, setCashType] = useState<"cash_in" | "cash_out">("cash_out");
  const [cashAmountInput, setCashAmountInput] = useState("");
  const [cashReasonInput, setCashReasonInput] = useState("");

  // Close Shift State
  const [actualCashInput, setActualCashInput] = useState("");
  const [closingNotesInput, setClosingNotesInput] = useState("");
  const [closedShiftToPrint, setClosedShiftToPrint] = useState<ShiftType | null>(null);

  // Active shift calculations
  const shiftMetrics = useMemo(() => {
    if (!currentShift) {
      return {
        startingFloat: 0,
        cashSales: 0,
        qrSales: 0,
        cardSales: 0,
        totalSales: 0,
        totalOrders: 0,
        totalCashIn: 0,
        totalCashOut: 0,
        expectedCash: 0,
      };
    }

    const startingFloat = Number(currentShift.startingFloat) || 0;
    const cashSales = Number(currentShift.salesSummary?.cashSales) || 0;
    const qrSales = Number(currentShift.salesSummary?.qrSales) || 0;
    const cardSales = Number(currentShift.salesSummary?.cardSales) || 0;
    const totalSales = Number(currentShift.salesSummary?.totalSales) || 0;
    const totalOrders = Number(currentShift.salesSummary?.totalOrders) || 0;

    let totalCashIn = 0;
    let totalCashOut = 0;
    for (const tx of currentShift.cashTransactions || []) {
      if (tx.type === "cash_in") {
        totalCashIn += tx.amount;
      } else {
        totalCashOut += tx.amount;
      }
    }

    const expectedCash = startingFloat + cashSales + totalCashIn - totalCashOut;

    return {
      startingFloat,
      cashSales,
      qrSales,
      cardSales,
      totalSales,
      totalOrders,
      totalCashIn,
      totalCashOut,
      expectedCash,
    };
  }, [currentShift]);

  // Actual difference calculation when closing
  const actualCashNumber = Number(actualCashInput) || 0;
  const differenceAmount = actualCashNumber - shiftMetrics.expectedCash;

  // Handle open shift submit
  const handleOpenShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const floatAmount = Number(startingFloatInput) || 0;
    const staffName =
      (session?.user as any)?.username ||
      (session?.user as any)?.name ||
      "Cashier";
    const staffId = session?.user?._id || "staff";

    openShift({
      startingFloat: floatAmount,
      staffId,
      staffName,
    });
  };

  // Handle Cash In / Out submit
  const handleCashInOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(cashAmountInput) || 0;
    if (amount <= 0) {
      ToastService.error(
        lang === "la" ? "ກະລຸນາໃສ່ຈຳນວນເງິນທີ່ຖືກຕ້ອງ" : "Please enter a valid amount"
      );
      return;
    }
    if (!cashReasonInput.trim()) {
      ToastService.error(
        lang === "la" ? "ກະລຸນາໃສ່ເຫດຜົນການເຄື່ອນໄຫວເງິນ" : "Please enter a reason"
      );
      return;
    }

    addCashTransaction({
      type: cashType,
      amount,
      reason: cashReasonInput,
    });

    setCashAmountInput("");
    setCashReasonInput("");
    setShiftModalOpen(true, "manage");
  };

  // Handle Close Shift submit
  const handleCloseShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const closed = closeShift({
      actualCash: actualCashNumber,
      closingNotes: closingNotesInput,
    });

    if (closed) {
      setClosedShiftToPrint(closed);
      setActualCashInput("");
      setClosingNotesInput("");
      setShiftModalOpen(true, "z_report");
    }
  };

  // Print Thermal Z-Report (Shift Summary Receipt)
  const handlePrintZReport = (shiftToPrint: ShiftType | null) => {
    const shift = shiftToPrint || lastClosedShift || closedShiftToPrint;
    if (!shift) return;

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

    let totalCashIn = 0;
    let totalCashOut = 0;
    for (const tx of shift.cashTransactions || []) {
      if (tx.type === "cash_in") {
        totalCashIn += tx.amount;
      } else {
        totalCashOut += tx.amount;
      }
    }

    const startingFloat = Number(shift.startingFloat) || 0;
    const cashSales = Number(shift.salesSummary?.cashSales) || 0;
    const qrSales = Number(shift.salesSummary?.qrSales) || 0;
    const cardSales = Number(shift.salesSummary?.cardSales) || 0;
    const totalSales = Number(shift.salesSummary?.totalSales) || 0;
    const expectedCash = shift.expectedCash || startingFloat + cashSales + totalCashIn - totalCashOut;
    const actualCash = shift.actualCash || 0;
    const difference = shift.difference || actualCash - expectedCash;

    let diffText = "0 ₭ (Balanced)";
    let diffColor = "#059669";
    if (difference < 0) {
      diffText = `${difference.toLocaleString()} ₭ (SHORT)`;
      diffColor = "#dc2626";
    } else if (difference > 0) {
      diffText = `+${difference.toLocaleString()} ₭ (OVER)`;
      diffColor = "#d97706";
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Z-Report - Shift Summary</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body {
              margin: 0; padding: 12px; width: 72mm;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 11px; line-height: 1.4; color: #000; background: #fff;
              box-sizing: border-box;
            }
            .header { text-align: center; margin-bottom: 8px; }
            .brand { font-size: 14px; font-weight: 900; }
            .badge {
              display: inline-block; border: 1.5px solid #000; font-size: 11px;
              font-weight: 900; padding: 2px 8px; border-radius: 4px; margin-top: 4px;
            }
            .divider { border-top: 1px dashed #333; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .label { color: #555; }
            .val { font-weight: 600; }
            .section-title { font-weight: 800; font-size: 11px; margin-top: 6px; margin-bottom: 4px; text-transform: uppercase; }
            .footer { text-align: center; font-size: 10px; color: #666; margin-top: 14px; }
            .signature { margin-top: 24px; padding-top: 4px; border-top: 1px solid #999; text-align: center; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">LAO WORLD RESTAURANT</div>
            <div style="font-size: 10px; color: #444;">Vientiane, Lao PDR</div>
            <div class="badge">Z-REPORT (SHIFT SUMMARY)</div>
          </div>

          <div class="divider"></div>

          <div class="row">
            <span class="label">Shift Number:</span>
            <span class="val">${shift.shiftNumber}</span>
          </div>
          <div class="row">
            <span class="label">Cashier:</span>
            <span class="val">${shift.staffName}</span>
          </div>
          <div class="row">
            <span class="label">Opened At:</span>
            <span>${new Date(shift.openedAt).toLocaleString()}</span>
          </div>
          <div class="row">
            <span class="label">Closed At:</span>
            <span>${shift.closedAt ? new Date(shift.closedAt).toLocaleString() : new Date().toLocaleString()}</span>
          </div>

          <div class="divider"></div>

          <div class="section-title">SALES BREAKDOWN</div>
          <div class="row">
            <span class="label">Cash Sales:</span>
            <span class="val">${cashSales.toLocaleString()} ₭</span>
          </div>
          <div class="row">
            <span class="label">QR / Transfer:</span>
            <span class="val">${qrSales.toLocaleString()} ₭</span>
          </div>
          <div class="row">
            <span class="label">Credit Card:</span>
            <span class="val">${cardSales.toLocaleString()} ₭</span>
          </div>
          <div class="row" style="font-weight: 800; font-size: 12px; border-top: 1px solid #ccc; padding-top: 3px; margin-top: 3px;">
            <span>TOTAL SALES:</span>
            <span>${totalSales.toLocaleString()} ₭</span>
          </div>
          <div class="row" style="font-size: 10px; color: #666;">
            <span>Total Completed Bills:</span>
            <span>${shift.salesSummary?.totalOrders || 0} bills</span>
          </div>

          <div class="divider"></div>

          <div class="section-title">CASH DRAWER RECONCILIATION</div>
          <div class="row">
            <span class="label">Starting Cash Float:</span>
            <span>${startingFloat.toLocaleString()} ₭</span>
          </div>
          <div class="row">
            <span class="label">(+) Cash Sales:</span>
            <span>+${cashSales.toLocaleString()} ₭</span>
          </div>
          <div class="row">
            <span class="label">(+) Cash In:</span>
            <span>+${totalCashIn.toLocaleString()} ₭</span>
          </div>
          <div class="row">
            <span class="label">(-) Cash Out:</span>
            <span>-${totalCashOut.toLocaleString()} ₭</span>
          </div>
          <div class="row" style="font-weight: 700; border-top: 1px dashed #777; padding-top: 3px; margin-top: 3px;">
            <span>Expected Cash:</span>
            <span>${expectedCash.toLocaleString()} ₭</span>
          </div>
          <div class="row" style="font-weight: 800; font-size: 12px; margin-top: 2px;">
            <span>Actual Cash Counted:</span>
            <span>${actualCash.toLocaleString()} ₭</span>
          </div>
          <div class="row" style="font-weight: 900; font-size: 12px; color: ${diffColor}; border-top: 1px solid #000; padding-top: 4px; margin-top: 4px;">
            <span>DIFFERENCE:</span>
            <span>${diffText}</span>
          </div>

          ${
            shift.closingNotes
              ? `<div style="margin-top: 6px; font-size: 10px; font-style: italic;">* Note: ${shift.closingNotes}</div>`
              : ""
          }

          <div class="signature">
            Cashier Signature: _______________________
          </div>

          <div class="footer">
            Printed on: ${new Date().toLocaleString()}
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
      }, 2000);
    }, 300);
  };

  return (
    <Dialog
      open={shiftModalOpen}
      onClose={() => setShiftModalOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "18px", overflow: "hidden" },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #0A3981 0%, #1F4E96 100%)",
          color: "#fff",
          p: 2.5,
          position: "relative",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-xl">
            <i className="tabler-coin" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white leading-tight">
              {lang === "la"
                ? "ຈັດການກະ & ລີ້ນຊັກເງິນສົດ (Shift & Cash Drawer)"
                : "Shift & Cash Drawer Management"}
            </h3>
            <p className="text-xs text-blue-100 font-normal">
              {currentShift
                ? `${currentShift.shiftNumber} • ${lang === "la" ? "ກຳລັງເປີດໃຊ້ງານ" : "Active"}`
                : lang === "la"
                ? "ຍັງບໍ່ໄດ້ເປີດກະເຮັດວຽກ"
                : "No active shift open"}
            </p>
          </div>
        </div>

        <IconButton
          onClick={() => setShiftModalOpen(false)}
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            color: "rgba(255,255,255,0.8)",
            "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.15)" },
          }}
          size="small"
        >
          <i className="tabler-x text-lg" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* MODE 1: OPEN SHIFT (When no active shift) */}
        {shiftModalMode === "open" && (
          <form onSubmit={handleOpenShiftSubmit} className="flex flex-col gap-4 py-1">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
              <i className="tabler-info-circle text-lg text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                {lang === "la"
                  ? "ກະລຸນາກວດນັບເງິນທອນເລີ່ມຕົ້ນ ແລະ ໃສ່ຈຳນວນເງິນສົດໃນລີ້ນຊັກກ່ອນເລີ່ມຂາຍ"
                  : "Please count your starting cash float in the drawer before opening the shift."}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                {lang === "la"
                  ? "ເງິນທອນເລີ່ມຕົ້ນໃນລີ້ນຊັກ (Starting Cash Float):"
                  : "Starting Cash Float (₭):"}
              </label>
              <TextField
                required
                fullWidth
                type="number"
                size="small"
                value={startingFloatInput}
                onChange={(e) => setStartingFloatInput(e.target.value)}
                InputProps={{
                  startAdornment: <span className="text-gray-400 font-bold mr-2">₭</span>,
                  sx: { borderRadius: "10px", fontSize: "1.1rem", fontWeight: 700 },
                }}
              />

              {/* Quick Float Chips */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {[200000, 500000, 1000000, 2000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setStartingFloatInput(String(amt))}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all border border-gray-200 dark:border-gray-700"
                  >
                    {amt.toLocaleString()} ₭
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1 pt-1">
              <div>
                <strong>{lang === "la" ? "ພະນັກງານແຄຊເຊຍ:" : "Cashier:"}</strong>{" "}
                {(session?.user as any)?.username || (session?.user as any)?.name || "Cashier"}
              </div>
              <div>
                <strong>{lang === "la" ? "ວັນທີ & ເວລາ:" : "Date & Time:"}</strong>{" "}
                {new Date().toLocaleString()}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#0A3981",
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#082d5c" },
                }}
                startIcon={<i className="tabler-door-enter text-base" />}
              >
                {lang === "la" ? "ເປີດກະເຮັດວຽກ (Open Shift)" : "Open Shift"}
              </Button>
            </div>
          </form>
        )}

        {/* MODE 2: MANAGE ACTIVE SHIFT */}
        {shiftModalMode === "manage" && currentShift && (
          <div className="flex flex-col gap-4 py-1">
            {/* Shift Header Status */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {lang === "la" ? "ເລກທີກະປັດຈຸບັນ" : "Current Shift"}
                </span>
                <h4 className="font-extrabold text-base text-gray-900 dark:text-gray-100 font-mono">
                  {currentShift.shiftNumber}
                </h4>
                <span className="text-xs text-gray-500">
                  {lang === "la" ? "ເປີດເມື່ອ:" : "Opened:"}{" "}
                  {new Date(currentShift.openedAt).toLocaleTimeString()} • {currentShift.staffName}
                </span>
              </div>

              <Chip
                label={lang === "la" ? "ກຳລັງເປີດຢູ່" : "Shift Open"}
                color="success"
                size="small"
                sx={{ fontWeight: 700, fontSize: "11px" }}
              />
            </div>

            {/* Cash Drawer Reconciliation Overview Card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>{lang === "la" ? "ເງິນທອນເລີ່ມຕົ້ນ:" : "Starting Float:"}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shiftMetrics.startingFloat.toLocaleString()} ₭
                </span>
              </div>

              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <span>{lang === "la" ? "(+) ຍອດຂາຍເງິນສົດ:" : "(+) Cash Sales:"}</span>
                <span>+{shiftMetrics.cashSales.toLocaleString()} ₭</span>
              </div>

              <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                <span>{lang === "la" ? "(+) ເງິນສົດເຂົ້າ (Cash In):" : "(+) Cash In:"}</span>
                <span>+{shiftMetrics.totalCashIn.toLocaleString()} ₭</span>
              </div>

              <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
                <span>{lang === "la" ? "(-) ເງິນສົດອອກ (Cash Out):" : "(-) Cash Out:"}</span>
                <span>-{shiftMetrics.totalCashOut.toLocaleString()} ₭</span>
              </div>

              {/* Expected Total Cash in Drawer */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-baseline font-bold">
                <span className="text-gray-900 dark:text-white text-xs uppercase">
                  {lang === "la" ? "ເງິນສົດທີ່ຄວນມີໃນລີ້ນຊັກ:" : "Expected Cash in Drawer:"}
                </span>
                <span className="text-base text-[#0A3981] dark:text-blue-400 font-extrabold">
                  {shiftMetrics.expectedCash.toLocaleString()} ₭
                </span>
              </div>
            </div>

            {/* Other Payment Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">
                  {lang === "la" ? "QR / ໂອນເງິນ" : "QR / Transfer"}
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                  {shiftMetrics.qrSales.toLocaleString()} ₭
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">
                  {lang === "la" ? "ຍອດຂາຍລວມທັງໝົດ" : "Total Sales"}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {shiftMetrics.totalSales.toLocaleString()} ₭
                </span>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="outlined"
                onClick={() => {
                  setCashType("cash_in");
                  setShiftModalOpen(true, "cash_in_out");
                }}
                sx={{
                  textTransform: "none",
                  py: 1,
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "10px",
                }}
                startIcon={<i className="tabler-plus text-sm" />}
              >
                {lang === "la" ? "ເງິນເຂົ້າ (+)" : "Cash In (+)"}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setCashType("cash_out");
                  setShiftModalOpen(true, "cash_in_out");
                }}
                sx={{
                  textTransform: "none",
                  py: 1,
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "10px",
                }}
                startIcon={<i className="tabler-minus text-sm" />}
              >
                {lang === "la" ? "ເງິນອອກ (-)" : "Cash Out (-)"}
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => setShiftModalOpen(true, "close")}
                sx={{
                  textTransform: "none",
                  py: 1,
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "10px",
                }}
                startIcon={<i className="tabler-door-exit text-sm" />}
              >
                {lang === "la" ? "ປິດກະ (Close)" : "Close Shift"}
              </Button>
            </div>
          </div>
        )}

        {/* MODE 3: CASH IN / CASH OUT */}
        {shiftModalMode === "cash_in_out" && (
          <form onSubmit={handleCashInOutSubmit} className="flex flex-col gap-4 py-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                {cashType === "cash_in"
                  ? lang === "la"
                    ? "ບັນທຶກເງິນສົດເຂົ້າລີ້ນຊັກ (Cash In)"
                    : "Add Cash In to Drawer"
                  : lang === "la"
                  ? "ບັນທຶກເງິນສົດອອກຈາກລີ້ນຊັກ (Cash Out)"
                  : "Pay Cash Out from Drawer"}
              </h4>

              <Button
                size="small"
                onClick={() => setShiftModalOpen(true, "manage")}
                sx={{ textTransform: "none", fontSize: "11px" }}
              >
                {lang === "la" ? "← ກັບຄືນ" : "← Back"}
              </Button>
            </div>

            {/* Type selector */}
            <RadioGroup
              row
              value={cashType}
              onChange={(e) => setCashType(e.target.value as "cash_in" | "cash_out")}
            >
              <FormControlLabel
                value="cash_in"
                control={<Radio size="small" />}
                label={lang === "la" ? "ເງິນເຂົ້າ (+) Cash In" : "Cash In (+)"}
              />
              <FormControlLabel
                value="cash_out"
                control={<Radio size="small" />}
                label={lang === "la" ? "ເງິນອອກ (-) Cash Out" : "Cash Out (-)"}
              />
            </RadioGroup>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                {lang === "la" ? "ຈຳນວນເງິນ (Amount ₭):" : "Amount (₭):"}
              </label>
              <TextField
                required
                fullWidth
                type="number"
                size="small"
                value={cashAmountInput}
                onChange={(e) => setCashAmountInput(e.target.value)}
                placeholder="50,000"
                InputProps={{
                  startAdornment: <span className="text-gray-400 font-bold mr-2">₭</span>,
                  sx: { borderRadius: "10px", fontWeight: 700 },
                }}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                {lang === "la" ? "ເຫດຜົນ / ລາຍລະອຽດ (Reason):" : "Reason / Purpose:"}
              </label>
              <TextField
                required
                fullWidth
                size="small"
                value={cashReasonInput}
                onChange={(e) => setCashReasonInput(e.target.value)}
                placeholder={
                  cashType === "cash_in"
                    ? lang === "la"
                      ? "ເຊັ່ນ: ຕື່ມເງິນທອນເພີ່ມ"
                      : "e.g. Add float"
                    : lang === "la"
                    ? "ເຊັ່ນ: ຈ່າຍຄ່ານ້ຳກ້ອນດ່ວນ"
                    : "e.g. Ice purchase"
                }
                InputProps={{ sx: { borderRadius: "10px" } }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: cashType === "cash_in" ? "#0A3981" : "#d97706",
                py: 1.2,
                fontWeight: 700,
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: cashType === "cash_in" ? "#082d5c" : "#b45309",
                },
              }}
            >
              {lang === "la" ? "ບັນທຶກລາຍການ" : "Save Transaction"}
            </Button>
          </form>
        )}

        {/* MODE 4: CLOSE SHIFT RECONCILIATION */}
        {shiftModalMode === "close" && currentShift && (
          <form onSubmit={handleCloseShiftSubmit} className="flex flex-col gap-4 py-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-base text-gray-900 dark:text-gray-100">
                  {lang === "la" ? "ປິດກະ & ນັບເງິນສົດ (Close Shift)" : "Close Shift & Reconciliation"}
                </h4>
                <p className="text-xs text-gray-500">{currentShift.shiftNumber}</p>
              </div>

              <Button
                size="small"
                onClick={() => setShiftModalOpen(true, "manage")}
                sx={{ textTransform: "none", fontSize: "11px" }}
              >
                {lang === "la" ? "← ກັບຄືນ" : "← Back"}
              </Button>
            </div>

            {/* Expected Summary */}
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {lang === "la" ? "ເງິນທອນເລີ່ມຕົ້ນ:" : "Starting Float:"}
                </span>
                <span>{shiftMetrics.startingFloat.toLocaleString()} ₭</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {lang === "la" ? "(+) ຍອດຂາຍເງິນສົດ:" : "(+) Cash Sales:"}
                </span>
                <span>+{shiftMetrics.cashSales.toLocaleString()} ₭</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {lang === "la" ? "(+/-) ເງິນເຂົ້າ-ອອກ:" : "(+/-) Net Cash In/Out:"}
                </span>
                <span>
                  {(shiftMetrics.totalCashIn - shiftMetrics.totalCashOut).toLocaleString()} ₭
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-gray-200 dark:border-gray-700 text-[#0A3981] dark:text-blue-400">
                <span>{lang === "la" ? "ເງິນສົດທີ່ຄວນມີ (Expected):" : "Expected Cash:"}</span>
                <span>{shiftMetrics.expectedCash.toLocaleString()} ₭</span>
              </div>
            </div>

            {/* Actual Cash Input */}
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                {lang === "la"
                  ? "ເງິນສົດຕົວຈິງທີ່ນັບໄດ້ໃນລີ້ນຊັກ (Actual Count):"
                  : "Actual Cash Counted in Drawer (₭):"}
              </label>
              <TextField
                required
                fullWidth
                type="number"
                size="small"
                value={actualCashInput}
                onChange={(e) => setActualCashInput(e.target.value)}
                placeholder={String(shiftMetrics.expectedCash)}
                InputProps={{
                  startAdornment: <span className="text-gray-400 font-bold mr-2">₭</span>,
                  sx: { borderRadius: "10px", fontSize: "1.2rem", fontWeight: 800 },
                }}
              />

              {/* Difference Result Card */}
              {actualCashInput !== "" && (
                <div
                  className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    differenceAmount === 0
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200"
                      : differenceAmount < 0
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-200"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-200"
                  }`}
                >
                  <span>
                    {differenceAmount === 0
                      ? lang === "la"
                        ? "ຍອດເງິນສົດກົງກັນພໍດີ (Balanced)"
                        : "Cash Perfectly Balanced"
                      : differenceAmount < 0
                      ? lang === "la"
                        ? "ຍອດເງິນຂາດ (Cash Short):"
                        : "Cash Short:"
                      : lang === "la"
                      ? "ຍອດເງິນເກີນ (Cash Over):"
                      : "Cash Over:"}
                  </span>
                  <span className="text-sm font-extrabold">
                    {differenceAmount > 0 ? `+${differenceAmount.toLocaleString()}` : differenceAmount.toLocaleString()} ₭
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                {lang === "la" ? "ໝາຍເຫດປິດກະ (Closing Notes):" : "Closing Notes:"}
              </label>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                value={closingNotesInput}
                onChange={(e) => setClosingNotesInput(e.target.value)}
                placeholder={lang === "la" ? "ໝາຍເຫດເພີ່ມເຕີມ..." : "Additional notes..."}
                InputProps={{ sx: { borderRadius: "10px" } }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              sx={{
                py: 1.2,
                fontWeight: 700,
                borderRadius: "10px",
              }}
              startIcon={<i className="tabler-door-exit text-base" />}
            >
              {lang === "la"
                ? "ຢືນຢັນປິດກະ & ອອກໃບສະຫຼຸບ (Close Shift)"
                : "Confirm Close Shift & Print"}
            </Button>
          </form>
        )}

        {/* MODE 5: Z-REPORT MODAL (Shift Closed Confirmation) */}
        {shiftModalMode === "z_report" && (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
              <i className="tabler-check" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100">
                {lang === "la" ? "ປິດກະເຮັດວຽກສຳເລັດແລ້ວ!" : "Shift Closed Successfully!"}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
                {lang === "la"
                  ? "ຍອດຂາຍ ແລະ ການນັບເງິນສົດຖືກບັນທຶກລົງໃນປະຫວັດລະບົບຮຽບຮ້ອຍແລ້ວ"
                  : "All shift sales and cash reconciliation records have been saved to shift history."}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full pt-2">
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShiftModalOpen(false)}
                sx={{ py: 1, fontWeight: 600, borderRadius: "10px" }}
              >
                {lang === "la" ? "ປິດໜ້າຕ່າງ" : "Close Window"}
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={() => handlePrintZReport(closedShiftToPrint || lastClosedShift)}
                sx={{
                  backgroundColor: "#0A3981",
                  py: 1,
                  fontWeight: 700,
                  borderRadius: "10px",
                  "&:hover": { backgroundColor: "#082d5c" },
                }}
                startIcon={<i className="tabler-printer text-base" />}
              >
                {lang === "la" ? "ພິມໃບ Z-Report (80mm)" : "Print Z-Report (80mm)"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PosShiftModalComponent;
