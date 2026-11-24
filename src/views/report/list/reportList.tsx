"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { LOAD_ORDER } from "@/gql/queries/order";
import { LOAD_TABLE } from "@/gql/queries/table";
import { LOAD_ZONE } from "@/gql/queries/zone";
import { LOAD_CATEGORY } from "@/gql/queries/category";
import { LOAD_MENU_ITEM } from "@/gql/queries/menuItem";
import { OrderType, POSTableType } from "@/views/pos/type/posType";
import {
  ReportListProps,
  DateRangePreset,
  ReportSummaryType,
  TopSellingItemType,
  PrintableReceiptModalData,
} from "../type/reportType";
import { ToastService } from "@/utils/toastService";

import ReportHeaderComponent from "./components/reportHeader.component";
import ReportSummaryCardsComponent from "./components/reportSummaryCards.component";
import ReportBreakdownCardsComponent from "./components/reportBreakdownCards.component";
import ReportOrdersTableComponent from "./components/reportOrdersTable.component";
import ReportOrderDetailsModal from "./components/reportOrderDetailsModal.component";
import ReportReceiptModal from "./components/reportReceiptModal.component";

export const ReportList: React.FC<{ props: ReportListProps }> = ({ props }) => {
  const { lang, dictionary } = props;
  const isLao = lang.startsWith("la");

  // State
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
  const [tables, setTables] = useState<POSTableType[]>([]);
  const [zones, setZones] = useState<Array<{ _id: string; name: string }>>([]);

  // Filters
  const [datePreset, setDatePreset] = useState<DateRangePreset>("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTableFilter, setSelectedTableFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"paid" | "cancelled" | "all">("all");

  // Modals
  const [viewingOrder, setViewingOrder] = useState<OrderType | null>(null);
  const [receiptData, setReceiptData] = useState<PrintableReceiptModalData | null>(null);

  // GraphQL queries
  const [loadOrderCall] = useLazyQuery(LOAD_ORDER, { fetchPolicy: "network-only" });
  const [loadTableCall] = useLazyQuery(LOAD_TABLE, { fetchPolicy: "network-only" });
  const [loadZoneCall] = useLazyQuery(LOAD_ZONE, { fetchPolicy: "network-only" });

  // Load Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersRes, tablesRes, zonesRes] = await Promise.all([
        loadOrderCall({ variables: { input: { limit: 500 } } }),
        loadTableCall({ variables: { input: { limit: 100, isActive: "active" } } }),
        loadZoneCall({ variables: { input: { limit: 100, isActive: "active" } } }),
      ]);

      const loadedOrders = ordersRes.data?.loadOrder?.order || [];
      const loadedTables = tablesRes.data?.loadTable?.table || [];
      const loadedZones = zonesRes.data?.loadZone?.zone || [];

      setAllOrders(loadedOrders);
      setTables(loadedTables);
      setZones(loadedZones);
    } catch (err: any) {
      console.error("Error loading report data:", err);
      ToastService.error(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, [loadOrderCall, loadTableCall, loadZoneCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper: map tableId to info
  const getTableInfo = useCallback(
    (tableId?: string) => {
      if (!tableId) return { number: "-", zoneName: "" };
      const t = tables.find((item) => item._id === tableId);
      if (!t) return { number: tableId.slice(-4), zoneName: "" };
      const z = zones.find((item) => item._id === t.zoneId);
      const zoneName = z ? z.name : t.zoneName || "";
      return { number: t.number, zoneName };
    },
    [tables, zones]
  );

  // Helper: Date filtering
  const checkDateInRange = useCallback(
    (dateStr?: string): boolean => {
      if (!dateStr) return false;
      const orderDate = new Date(dateStr);
      const now = new Date();

      if (datePreset === "all") {
        return true;
      }

      if (datePreset === "today") {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (datePreset === "yesterday") {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return (
          orderDate.getDate() === yesterday.getDate() &&
          orderDate.getMonth() === yesterday.getMonth() &&
          orderDate.getFullYear() === yesterday.getFullYear()
        );
      }

      if (datePreset === "week") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return orderDate >= sevenDaysAgo && orderDate <= now;
      }

      if (datePreset === "month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (datePreset === "custom") {
        if (!customStartDate && !customEndDate) return true;
        let passStart = true;
        let passEnd = true;
        if (customStartDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          passStart = orderDate >= start;
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          passEnd = orderDate <= end;
        }
        return passStart && passEnd;
      }

      return true;
    },
    [datePreset, customStartDate, customEndDate]
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // 1. Date filter
      if (!checkDateInRange(order.createdAt)) {
        return false;
      }

      // 2. Status filter
      if (statusFilter === "paid" && order.status !== "paid") {
        return false;
      }
      if (statusFilter === "cancelled" && order.status !== "cancelled") {
        return false;
      }

      // 3. Table filter
      if (selectedTableFilter !== "all" && order.tableId !== selectedTableFilter) {
        return false;
      }

      // 4. Search keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchesNum = order.orderNumber?.toLowerCase().includes(kw);
        const matchesNote = order.note?.toLowerCase().includes(kw);
        const tInfo = getTableInfo(order.tableId);
        const matchesTable = tInfo.number.toLowerCase().includes(kw);
        if (!matchesNum && !matchesNote && !matchesTable) {
          return false;
        }
      }

      return true;
    });
  }, [allOrders, checkDateInRange, statusFilter, selectedTableFilter, searchKeyword, getTableInfo]);

  // Metrics Summary
  const summary: ReportSummaryType = useMemo(() => {
    const paidOrders = filteredOrders.filter((o) => o.status === "paid");
    const cancelledOrders = filteredOrders.filter((o) => o.status === "cancelled");

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalDiscount = paidOrders.reduce((sum, o) => sum + (Number(o.discount) || 0), 0);
    const paidCount = paidOrders.length;
    const avgOrderValue = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;

    return {
      totalRevenue,
      totalDiscount,
      totalOrdersCount: filteredOrders.length,
      avgOrderValue,
      paidOrdersCount: paidCount,
      cancelledOrdersCount: cancelledOrders.length,
    };
  }, [filteredOrders]);

  // Top Selling Items (from paid orders in current range)
  const topItems: TopSellingItemType[] = useMemo(() => {
    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    filteredOrders
      .filter((o) => o.status === "paid")
      .forEach((order) => {
        (order.items || []).forEach((item) => {
          const key = item.menuItemId || item.menuItemName;
          const current = itemMap.get(key) || {
            name: item.menuItemName || "Unknown",
            quantity: 0,
            revenue: 0,
          };
          current.quantity += Number(item.quantity) || 0;
          current.revenue += Number(item.totalPrice) || 0;
          itemMap.set(key, current);
        });
      });

    const list = Array.from(itemMap.entries()).map(([id, data]) => ({
      menuItemId: id,
      menuItemName: data.name,
      quantity: data.quantity,
      totalRevenue: data.revenue,
      percentage: 0,
    }));

    list.sort((a, b) => b.quantity - a.quantity);
    const top5 = list.slice(0, 5);

    const maxQty = top5.length > 0 ? top5[0].quantity : 1;
    top5.forEach((item) => {
      item.percentage = Math.round((item.quantity / maxQty) * 100);
    });

    return top5;
  }, [filteredOrders]);

  // Re-print receipt
  const handlePrintOrder = (order: OrderType) => {
    const tableInfo = getTableInfo(order.tableId);
    const items = (order.items || []).map((i) => ({
      name: i.menuItemName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
      note: i.note,
    }));

    setReceiptData({
      orderNumber: order.orderNumber,
      tableNumber: tableInfo.number,
      zoneName: tableInfo.zoneName,
      date: order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString(),
      items,
      subTotal: order.subTotal || 0,
      discount: order.discount || 0,
      total: order.total || 0,
      paymentMethod: order.status === "paid" ? "PAID" : order.status,
    });
  };

  // Export CSV
  const handleExportCsv = () => {
    if (filteredOrders.length === 0) {
      ToastService.warning(isLao ? "ບໍ່ມີຂໍ້ມູນສຳລັບສົ່ງອອກ" : "No orders to export");
      return;
    }

    const headers = [
      "Order Number",
      "Table",
      "Zone",
      "Date",
      "Time",
      "Items Count",
      "Status",
      "Subtotal",
      "Discount",
      "Total Amount",
    ];

    const rows = filteredOrders.map((o) => {
      const tInfo = getTableInfo(o.tableId);
      const itemsCount = (o.items || []).reduce((sum, i) => sum + i.quantity, 0);
      const dateObj = o.createdAt ? new Date(o.createdAt) : null;
      const dateStr = dateObj ? dateObj.toLocaleDateString() : "-";
      const timeStr = dateObj ? dateObj.toLocaleTimeString() : "-";

      return [
        `"${o.orderNumber || ""}"`,
        `"${tInfo.number}"`,
        `"${tInfo.zoneName}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        itemsCount,
        `"${o.status}"`,
        Number(o.subTotal || 0),
        Number(o.discount || 0),
        Number(o.total || 0),
      ].join(",");
    });

    // Add UTF-8 BOM so Excel opens Lao text cleanly
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sales_report_${datePreset}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ToastService.success(isLao ? "ດາວໂຫຼດໄຟລ໌ CSV ສຳເລັດແລ້ວ" : "CSV exported successfully!");
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* 1. Header Toolbar */}
      <ReportHeaderComponent
        lang={lang}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        onRefresh={fetchData}
        onExportCsv={handleExportCsv}
        loading={loading}
      />

      {/* 2. KPI Summary Cards */}
      <ReportSummaryCardsComponent summary={summary} lang={lang} />

      {/* 3. Top Selling & Status Distribution Breakdown */}
      <ReportBreakdownCardsComponent topItems={topItems} summary={summary} lang={lang} />

      {/* 4. Detailed Orders History Table */}
      <ReportOrdersTableComponent
        orders={filteredOrders}
        tables={tables}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        selectedTableFilter={selectedTableFilter}
        setSelectedTableFilter={setSelectedTableFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onViewOrder={setViewingOrder}
        onPrintOrder={handlePrintOrder}
        getTableInfo={getTableInfo}
        lang={lang}
      />

      {/* Order Details Modal */}
      <ReportOrderDetailsModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onPrint={handlePrintOrder}
        lang={lang}
        getTableInfo={getTableInfo}
      />

      {/* Thermal Receipt Print Modal */}
      <ReportReceiptModal
        receiptData={receiptData}
        onClose={() => setReceiptData(null)}
        lang={lang}
      />
    </div>
  );
};

export default ReportList;
