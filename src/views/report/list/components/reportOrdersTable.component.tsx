"use client";

import React, { useState } from "react";
import { OrderType, POSTableType } from "@/views/pos/type/posType";
import { Chip, Pagination } from "@mui/material";

interface ReportOrdersTableProps {
  orders: OrderType[];
  tables: POSTableType[];
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  selectedTableFilter: string;
  setSelectedTableFilter: (val: string) => void;
  statusFilter: "paid" | "cancelled" | "all";
  setStatusFilter: (val: "paid" | "cancelled" | "all") => void;
  onViewOrder: (order: OrderType) => void;
  onPrintOrder: (order: OrderType) => void;
  getTableInfo: (tableId?: string) => { number: string; zoneName: string };
  lang: string;
}

export const ReportOrdersTableComponent: React.FC<ReportOrdersTableProps> = ({
  orders,
  tables,
  searchKeyword,
  setSearchKeyword,
  selectedTableFilter,
  setSelectedTableFilter,
  statusFilter,
  setStatusFilter,
  onViewOrder,
  onPrintOrder,
  getTableInfo,
  lang,
}) => {
  const isLao = lang.startsWith("la");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const totalPages = Math.ceil(orders.length / pageSize) || 1;
  const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusColor = (status: string): "success" | "error" | "secondary" => {
    if (status === "paid") return "success";
    if (status === "cancelled") return "error";
    return "secondary";
  };

  const getStatusLabel = (status: string): string => {
    if (status === "paid") {
      return isLao ? "ຊຳລະແລ້ວ" : "PAID";
    }
    if (status === "cancelled") {
      return isLao ? "ຍົກເລີກ" : "CANCELLED";
    }
    return status.toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <i className="tabler-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder={isLao ? "ຄົ້ນຫາເລກບິນ, ເບີໂຕະ..." : "Search order # or table..."}
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#2F57AB]"
            />
          </div>

          {/* Table Filter Dropdown */}
          <select
            value={selectedTableFilter}
            onChange={(e) => {
              setSelectedTableFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 outline-none font-medium cursor-pointer"
          >
            <option value="all">{isLao ? "ທຸກໂຕະ (All Tables)" : "All Tables"}</option>
            {tables.map((t) => (
              <option key={t._id} value={t._id}>
                {isLao ? "ໂຕະ" : "Table"} {t.number}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Toggle */}
        <div className="inline-flex rounded-xl p-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold self-end md:self-auto">
          <button
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              statusFilter === "all"
                ? "bg-[#2F57AB] text-white shadow-2xs"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {isLao ? "ທັງໝົດ" : "All Status"}
          </button>
          <button
            onClick={() => {
              setStatusFilter("paid");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              statusFilter === "paid"
                ? "bg-[#2F57AB] text-white shadow-2xs"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {isLao ? "ຊຳລະແລ້ວ" : "Paid Only"}
          </button>
          <button
            onClick={() => {
              setStatusFilter("cancelled");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg transition-all ${
              statusFilter === "cancelled"
                ? "bg-[#2F57AB] text-white shadow-2xs"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {isLao ? "ຍົກເລີກ" : "Cancelled"}
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <i className="tabler-receipt-off text-3xl" />
            </div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200">
              {isLao ? "ບໍ່ພົບລາຍການບິນ" : "No orders found"}
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              {isLao
                ? "ບໍ່ມີຂໍ້ມູນບິນທີ່ກົງກັບເງື່ອນໄຂ ຫຼື ຊ່ວງວັນທີທີ່ເລືອກ"
                : "No order records match the selected date or search filter."}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4">{isLao ? "ເລກບິນ" : "Order #"}</th>
                <th className="py-3 px-4">{isLao ? "ໂຕະ / ໂຊນ" : "Table / Zone"}</th>
                <th className="py-3 px-4">{isLao ? "ວັນທີ & ເວລາ" : "Date & Time"}</th>
                <th className="py-3 px-4">{isLao ? "ລາຍການ" : "Items"}</th>
                <th className="py-3 px-4">{isLao ? "ສ່ວນຫຼຸດ" : "Discount"}</th>
                <th className="py-3 px-4 text-right">{isLao ? "ຍອດສຸດທິ" : "Total Amount"}</th>
                <th className="py-3 px-4 text-center">{isLao ? "ສະຖານະ" : "Status"}</th>
                <th className="py-3 px-4 text-center">{isLao ? "ຈັດການ" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedOrders.map((order) => {
                const tableInfo = getTableInfo(order.tableId);
                const itemsCount = (order.items || []).reduce((sum, i) => sum + i.quantity, 0);
                const dateObj = order.createdAt ? new Date(order.createdAt) : null;
                const timeFormatted = dateObj
                  ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "-";
                const dateFormatted = dateObj ? dateObj.toLocaleDateString() : "-";

                return (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Order # */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </td>

                    {/* Table / Zone */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {isLao ? "ໂຕະ" : "Table"} {tableInfo.number}
                        </span>
                        {tableInfo.zoneName && (
                          <span className="text-[10px] text-gray-400">({tableInfo.zoneName})</span>
                        )}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 text-gray-500">
                      <span>{dateFormatted}</span>
                      <span className="text-gray-400 ml-1 font-mono text-[11px]">{timeFormatted}</span>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {itemsCount} {isLao ? "ລາຍການ" : "items"}
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-4">
                      {Number(order.discount || 0) > 0 ? (
                        <span className="text-rose-500 font-medium">
                          -{Number(order.discount).toLocaleString()} ₭
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white text-sm">
                      {Number(order.total || 0).toLocaleString()} ₭
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                        variant="tonal"
                        sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                          title={isLao ? "ເບິ່ງລາຍລະອຽດ" : "View Details"}
                        >
                          <i className="tabler-eye text-base" />
                        </button>
                        <button
                          onClick={() => onPrintOrder(order)}
                          className="p-1.5 rounded-lg bg-[#2F57AB] hover:bg-[#25468a] text-white transition-colors shadow-2xs"
                          title={isLao ? "ພິມໃບບິນ" : "Print Receipt"}
                        >
                          <i className="tabler-printer text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>
            {isLao
              ? `ສະແດງ ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, orders.length)} ຈາກທັງໝົດ ${orders.length} ບິນ`
              : `Showing ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, orders.length)} of ${orders.length} orders`}
          </span>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            size="small"
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default ReportOrdersTableComponent;
