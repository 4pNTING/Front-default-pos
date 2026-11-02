"use client";

import React, { useState, useMemo, useCallback } from "react";
import { usePOSStore } from "../../store/posStore";
import { POSListProps, OrderType } from "../../type/posType";
import { Dialog, DialogTitle, DialogContent, IconButton, Button, Chip } from "@mui/material";

export const OrderHistoryComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { lang, dictionary: dic } = props;
  const { allOrders, tables, zones, openReceiptModal, silentRefresh } = usePOSStore();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTableFilter, setSelectedTableFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<"today" | "all">("today");
  const [statusFilter, setStatusFilter] = useState<"paid" | "all">("paid");
  const [viewingOrder, setViewingOrder] = useState<OrderType | null>(null);

  // Helper: map tableId to Table Name / Number
  const getTableInfo = useCallback((tableId?: string) => {
    if (!tableId) return { number: "-", zoneName: "" };
    const t = tables.find((item) => item._id === tableId);
    if (!t) return { number: tableId.slice(-4), zoneName: "" };
    return { number: t.number, zoneName: t.zoneName || "" };
  }, [tables]);

  // Helper: check if date is today
  const isToday = (dateString?: string) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  // Filter completed / historical orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      // Status filter
      if (statusFilter === "paid" && o.status !== "paid") return false;
      if (statusFilter === "all" && o.status !== "paid" && o.status !== "cancelled") return false;

      // Date filter
      if (dateFilter === "today" && !isToday(o.createdAt)) return false;

      // Table filter
      if (selectedTableFilter !== "all" && o.tableId !== selectedTableFilter) return false;

      // Search keyword (Order number or note)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchesNumber = o.orderNumber?.toLowerCase().includes(kw);
        const matchesNote = o.note?.toLowerCase().includes(kw);
        const tableInfo = getTableInfo(o.tableId);
        const matchesTable = tableInfo.number.toLowerCase().includes(kw);
        if (!matchesNumber && !matchesNote && !matchesTable) return false;
      }

      return true;
    });
  }, [allOrders, statusFilter, dateFilter, selectedTableFilter, searchKeyword, getTableInfo]);

  // Calculate Summary Metrics
  const summary = useMemo(() => {
    const paidOrders = filteredOrders.filter((o) => o.status === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalDiscount = paidOrders.reduce((sum, o) => sum + (Number(o.discount) || 0), 0);
    const totalOrdersCount = paidOrders.length;
    const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    return {
      totalRevenue,
      totalDiscount,
      totalOrdersCount,
      avgOrderValue,
    };
  }, [filteredOrders]);

  // Handle Re-print receipt
  const handleReprintReceipt = (order: OrderType) => {
    const tableInfo = getTableInfo(order.tableId);
    const receiptItems = (order.items || []).map((i) => ({
      name: i.menuItemName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
      note: i.note,
    }));

    openReceiptModal({
      type: "receipt",
      orderNumber: order.orderNumber,
      tableNumber: tableInfo.number,
      zoneName: tableInfo.zoneName,
      date: order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString(),
      items: receiptItems,
      subTotal: order.subTotal || 0,
      discount: order.discount || 0,
      total: order.total || 0,
      paymentMethod: "PAID",
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 space-y-4">
      {/* Top Sales Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-[#0A3981] to-[#1E56A0] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-200 font-medium">
              {lang === "la" ? "ຍອດຂາຍລວມ (Total Revenue)" : "Total Revenue"}
            </p>
            <h3 className="text-lg sm:text-2xl font-bold mt-1 tracking-tight">
              {summary.totalRevenue.toLocaleString()} ₭
            </h3>
            <span className="text-[11px] text-blue-200/80 mt-0.5 block">
              {dateFilter === "today" ? (lang === "la" ? "ສະເພາະມື້ນີ້" : "Today only") : (lang === "la" ? "ທຸກເວລາ" : "All time")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <i className="tabler-coins text-2xl" />
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {lang === "la" ? "ຈຳນວນບິນທີ່ສຳເລັດ" : "Completed Orders"}
            </p>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {summary.totalOrdersCount} <span className="text-xs font-normal text-gray-400">{lang === "la" ? "ບິນ" : "bills"}</span>
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
              <i className="tabler-check text-xs" /> {lang === "la" ? "ຊຳລະເງິນແລ້ວ" : "Paid successfully"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <i className="tabler-receipt text-2xl" />
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {lang === "la" ? "ຍອດຂາຍສະເລ່ຍ / ບິນ" : "Average Order Value"}
            </p>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {summary.avgOrderValue.toLocaleString()} ₭
            </h3>
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              {lang === "la" ? "ສະເລ່ຍຕໍ່ໂຕະ" : "Avg per order"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <i className="tabler-chart-pie text-2xl" />
          </div>
        </div>

        {/* Total Discounts Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {lang === "la" ? "ສ່ວນຫຼຸດລວມ (Total Discount)" : "Total Discount"}
            </p>
            <h3 className="text-lg sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {summary.totalDiscount.toLocaleString()} ₭
            </h3>
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              {lang === "la" ? "ສ່ວນຫຼຸດທີ່ໃຫ້ລູກຄ້າ" : "Discounts given"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <i className="tabler-discount-2 text-2xl" />
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-white dark:bg-gray-800 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <i className="tabler-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder={lang === "la" ? "ຄົ້ນຫາເລກບິນ, ເບີໂຕະ..." : "Search order # or table..."}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#2F57AB]"
            />
          </div>

          {/* Table Filter Dropdown */}
          <select
            value={selectedTableFilter}
            onChange={(e) => setSelectedTableFilter(e.target.value)}
            className="text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 outline-none font-medium cursor-pointer"
          >
            <option value="all">{lang === "la" ? "ທຸກໂຕະ (All Tables)" : "All Tables"}</option>
            {tables.map((t) => (
              <option key={t._id} value={t._id}>
                {lang === "la" ? "ໂຕະ" : "Table"} {t.number}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Date filter + Refresh */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          {/* Date Toggle: Today vs All */}
          <div className="inline-flex rounded-xl p-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold">
            <button
              onClick={() => setDateFilter("today")}
              className={`px-3 py-1 rounded-lg transition-all ${
                dateFilter === "today"
                  ? "bg-[#2F57AB] text-white shadow-2xs"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {lang === "la" ? "ມື້ນີ້ (Today)" : "Today"}
            </button>
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3 py-1 rounded-lg transition-all ${
                dateFilter === "all"
                  ? "bg-[#2F57AB] text-white shadow-2xs"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {lang === "la" ? "ທັງໝົດ (All Time)" : "All Time"}
            </button>
          </div>

          {/* Refresh Button */}
          {silentRefresh && (
            <button
              onClick={() => void silentRefresh()}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all shadow-2xs"
              title="Refresh Orders"
            >
              <i className="tabler-refresh text-base" />
            </button>
          )}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3">
              <i className="tabler-receipt-off text-3xl" />
            </div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200">
              {lang === "la" ? "ບໍ່ພົບປະຫວັດບິນ" : "No completed orders found"}
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              {dateFilter === "today"
                ? (lang === "la" ? "ຍັງບໍ່ມີບິນທີ່ຊຳລະເງິນສຳເລັດໃນມື້ນີ້" : "No orders paid today yet.")
                : (lang === "la" ? "ບໍ່ມີຂໍ້ມູນບິນທີ່ກົງກັບເງື່ອນໄຂຄົ້ນຫາ" : "No orders match the filter.")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {filteredOrders.map((order) => {
              const tableInfo = getTableInfo(order.tableId);
              const itemsCount = (order.items || []).reduce((sum, i) => sum + i.quantity, 0);
              const timeFormatted = order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "-";
              const dateFormatted = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "-";

              return (
                <div
                  key={order._id}
                  className="p-3.5 sm:p-4 hover:bg-gray-50/70 dark:hover:bg-gray-750 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Order Identifier & Table & Date */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2F57AB] dark:text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/60 text-sm">
                      {tableInfo.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                          {order.orderNumber}
                        </span>
                        <Chip
                          label={order.status === "paid" ? (lang === "la" ? "ຊຳລະແລ້ວ" : "PAID") : order.status}
                          size="small"
                          color={order.status === "paid" ? "success" : "secondary"}
                          variant="tonal"
                          sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                        />
                      </div>

                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>
                          {lang === "la" ? "ໂຕະ" : "Table"} {tableInfo.number} {tableInfo.zoneName ? `(${tableInfo.zoneName})` : ""}
                        </span>
                        <span>•</span>
                        <span>{dateFormatted} {timeFormatted}</span>
                        <span>•</span>
                        <span>{itemsCount} {lang === "la" ? "ລາຍການ" : "items"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total Amount & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700/50">
                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        {Number(order.total || 0).toLocaleString()} ₭
                      </div>
                      {Number(order.discount || 0) > 0 && (
                        <div className="text-[10px] text-rose-500 font-medium">
                          {lang === "la" ? "ຫຼຸດ" : "Disc"}: -{Number(order.discount).toLocaleString()} ₭
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* View Details Button */}
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1 transition-all"
                        title="View Details"
                      >
                        <i className="tabler-eye text-sm" />
                        <span className="hidden sm:inline">{lang === "la" ? "ລາຍລະອຽດ" : "Details"}</span>
                      </button>

                      {/* Re-print Receipt Button */}
                      <button
                        onClick={() => handleReprintReceipt(order)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#2F57AB] hover:bg-[#25468a] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all"
                        title="Print Receipt"
                      >
                        <i className="tabler-printer text-sm" />
                        <span>{lang === "la" ? "ພິມບິນ" : "Print"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <Dialog
          open={Boolean(viewingOrder)}
          onClose={() => setViewingOrder(null)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: { borderRadius: "16px", overflow: "hidden" },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#0A3981",
              color: "white",
            }}
          >
            <div className="flex items-center gap-2">
              <i className="tabler-receipt text-xl" />
              <div>
                <h4 className="font-bold text-sm leading-tight">{viewingOrder.orderNumber}</h4>
                <p className="text-xs text-blue-200 mt-0.5">
                  {lang === "la" ? "ໂຕະ" : "Table"} {getTableInfo(viewingOrder.tableId).number}
                </p>
              </div>
            </div>
            <IconButton
              onClick={() => setViewingOrder(null)}
              size="small"
              sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" } }}
            >
              <i className="tabler-x text-lg" />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 2.5 }}>
            <div className="space-y-3">
              {/* Order Meta info */}
              <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">{lang === "la" ? "ວັນທີ & ເວລາ" : "Date & Time"}:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleString() : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{lang === "la" ? "ສະຖານະ" : "Status"}:</span>
                  <span className="font-bold text-emerald-600 uppercase">{viewingOrder.status}</span>
                </div>
                {viewingOrder.note && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{lang === "la" ? "ໝາຍເຫດ" : "Note"}:</span>
                    <span className="text-gray-700 dark:text-gray-300 italic">{viewingOrder.note}</span>
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  {lang === "la" ? "ລາຍການອາຫານ" : "Ordered Items"} ({(viewingOrder.items || []).length})
                </h5>
                <div className="divide-y divide-gray-100 dark:divide-gray-700/60 max-h-48 overflow-y-auto pr-1">
                  {(viewingOrder.items || []).map((item, idx) => (
                    <div key={idx} className="py-2 flex items-start justify-between text-xs">
                      <div className="pr-2">
                        <div className="font-semibold text-gray-800 dark:text-gray-100">
                          {item.menuItemName}
                        </div>
                        {item.note && (
                          <div className="text-[10px] text-blue-600 dark:text-blue-400 italic">
                            * {item.note}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-400">
                          {item.unitPrice.toLocaleString()} ₭ × {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white shrink-0">
                        {item.totalPrice.toLocaleString()} ₭
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Section */}
              <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-2.5 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-500">
                  <span>{lang === "la" ? "ຍອດລວມກ່ອນຫຼຸດ" : "Subtotal"}:</span>
                  <span>{Number(viewingOrder.subTotal || 0).toLocaleString()} ₭</span>
                </div>
                {Number(viewingOrder.discount || 0) > 0 && (
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>{lang === "la" ? "ສ່ວນຫຼຸດ" : "Discount"}:</span>
                    <span>-{Number(viewingOrder.discount).toLocaleString()} ₭</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span>{lang === "la" ? "ຍອດຊຳລະສຸດທິ" : "Grand Total"}:</span>
                  <span className="text-[#2F57AB] dark:text-blue-400">
                    {Number(viewingOrder.total || 0).toLocaleString()} ₭
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  handleReprintReceipt(viewingOrder);
                  setViewingOrder(null);
                }}
                sx={{
                  backgroundColor: "#0A3981",
                  mt: 1,
                  py: 1,
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#082d5c" },
                }}
                startIcon={<i className="tabler-printer text-base" />}
              >
                {lang === "la" ? "ພິມໃບບິນໃໝ່ (Re-print)" : "Re-print Receipt"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrderHistoryComponent;

