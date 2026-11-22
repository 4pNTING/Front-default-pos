"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { useInventoryStore } from "../store/inventoryStore";
import { InventoryListProps } from "../type/inventoryType";
import { LOAD_INVENTORY, LOAD_LOW_STOCK_ALERT } from "@/gql/queries/inventory";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import InventoryModalComponent from "./components/inventoryModal.component";
import AdjustStockModalComponent from "./components/adjustStockModal.component";
import StockHistoryModalComponent from "./components/stockHistoryModal.component";
import LowStockBannerComponent from "./components/lowStockBanner.component";

export const InventoryList: React.FC<{ props: InventoryListProps }> = ({ props }) => {
  const { lang } = props;
  const isLao = lang === "la";

  const {
    inventoryList,
    lowStockItems,
    total,
    loadInventoryAPI,
    loadLowStockAlertAPI,
    selectedCategory,
    searchKeyword,
  } = useInventoryStore();

  const [loadInventoryCall] = useLazyQuery(LOAD_INVENTORY, {
    fetchPolicy: "network-only",
  });
  const [loadLowStockCall] = useLazyQuery(LOAD_LOW_STOCK_ALERT, {
    fetchPolicy: "network-only",
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    loadInventoryAPI({ query: loadInventoryCall });
    loadLowStockAlertAPI({ query: loadLowStockCall });
  }, [loadInventoryAPI, loadLowStockAlertAPI, loadInventoryCall, loadLowStockCall]);

  // Initial load
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh, selectedCategory]);

  // Search debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      loadInventoryAPI({ query: loadInventoryCall });
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchKeyword, loadInventoryAPI, loadInventoryCall]);

  // KPI Calculations
  const totalStockValue = inventoryList.reduce((sum, item) => {
    const qty = Number(item.currentStock) || 0;
    const cost = Number(item.costPerUnit) || 0;
    return sum + (qty * cost);
  }, 0);

  const outOfStockCount = inventoryList.filter(
    (item) => Number(item.currentStock || 0) <= 0
  ).length;

  return (
    <div className="space-y-4">
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Items */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider block">
              {isLao ? "ລາຍການວັດຖຸດິບທັງໝົດ" : "รายการสินค้าในคลัง"}
            </span>
            <div className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
              {total} <span className="text-xs font-normal text-gray-400">{isLao ? "ລາຍການ" : "รายการ"}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
            <i className="tabler-packages" />
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider block">
              {isLao ? "ມູນຄ່າສາງລວມ" : "มูลค่าสต็อกรวม"}
            </span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5 font-mono">
              {totalStockValue.toLocaleString()} <span className="text-xs font-normal">₭</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
            <i className="tabler-coins" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider block">
              {isLao ? "ສະຕັອກໃກ້ໝົດ" : "สต็อกใกล้หมด"}
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
              {lowStockItems.length} <span className="text-xs font-normal text-gray-400">{isLao ? "ລາຍການ" : "รายการ"}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
            <i className="tabler-alert-triangle" />
          </div>
        </div>

        {/* Out of Stock */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider block">
              {isLao ? "ສິນຄ້າໝົດແລ້ວ" : "สินค้าหมดสต็อก"}
            </span>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5 font-mono">
              {outOfStockCount} <span className="text-xs font-normal text-gray-400">{isLao ? "ລາຍການ" : "รายการ"}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shrink-0">
            <i className="tabler-circle-x" />
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      <LowStockBannerComponent props={props} />

      {/* Header Bar with Search & Filters */}
      <HeaderComponent props={props} onRefresh={handleRefresh} />

      {/* Main Table */}
      <TableComponent props={props} />

      {/* Modals */}
      <InventoryModalComponent props={props} />
      <AdjustStockModalComponent props={props} />
      <StockHistoryModalComponent props={props} />
    </div>
  );
};

export default InventoryList;
