"use client";

import React from "react";
import { usePOSStore } from "../../store/posStore";
import { POSListProps, IPosViewMode, IPosTableStatus } from "../../type/posType";

const HeaderComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  // Var
  const { lang, dictionary: dic } = props;

  const {
    viewMode,
    setViewMode,
    selectedTable,
    tables,
    menuSearchKeyword,
    setMenuSearchKeyword,
    silentRefresh,
    cart,
    currentOrder,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
  } = usePOSStore();

  const activeTable = selectedTable
    ? tables.find((t) => t._id === selectedTable._id) ?? selectedTable
    : null;

  const totalCartCount =
    cart.reduce((sum, item) => sum + item.quantity, 0) +
    (currentOrder?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0);

  return (
    <div className="bg-white dark:bg-[#1f293d] border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 sticky top-0 z-30">
      {/* Left: View Mode Navigation & Table Indicator */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex rounded-lg p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setViewMode(IPosViewMode.table)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === IPosViewMode.table
                ? "bg-[#2F57AB] text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <i className="tabler-layout-grid text-base" />
            <span>{dic.posPage?.tablesTab ?? dic.tablePage?.title ?? "Tables"}</span>
          </button>

          <button
            onClick={() => setViewMode(IPosViewMode.order)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all relative ${
              viewMode === IPosViewMode.order
                ? "bg-[#2F57AB] text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <i className="tabler-shopping-bag text-base" />
            <span>{dic.posPage?.menuTab ?? dic.menuItemPage?.title ?? "Order Menu"}</span>
            {totalCartCount > 0 && (
              <span className="ml-1 bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {totalCartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setViewMode(IPosViewMode.orders_list)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === IPosViewMode.orders_list
                ? "bg-[#2F57AB] text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <i className="tabler-clipboard-list text-base" />
            <span>{dic.posPage?.ordersQueueTab ?? "Orders Queue"}</span>
          </button>
        </div>

        {/* Selected Table Chip */}
        {activeTable ? (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium">
            <i className="tabler-armchair text-base" />
            <span>
              {dic.posPage?.table ?? "Table"} <strong>{activeTable.number}</strong>
              {activeTable.zoneName ? ` (${activeTable.zoneName})` : ""}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                activeTable.status === IPosTableStatus.occupied
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {activeTable.status === IPosTableStatus.occupied
                ? dic.posPage?.statusOccupied ?? activeTable.status
                : activeTable.status === IPosTableStatus.available
                ? dic.posPage?.statusAvailable ?? activeTable.status
                : activeTable.status}
            </span>
          </div>
        ) : (
          <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-1.5 rounded-lg">
            {dic.posPage?.noTableSelected ?? "No table selected (Select a table to start)"}
          </span>
        )}
      </div>

      {/* Right: Search, Live Auto-Refresh & Manual Refresh */}
      <div className="flex items-center gap-2">
        {viewMode === IPosViewMode.order && (
          <div className="relative flex-1 md:w-64">
            <i className="tabler-search absolute left-3 top-2.5 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder={dic.posPage?.searchMenuPlaceholder ?? dic.placeHolder?.search ?? "Search menu items..."}
              value={menuSearchKeyword}
              onChange={(e) => setMenuSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB] dark:focus:border-blue-400 focus:bg-white transition-all"
            />
            {menuSearchKeyword && (
              <button
                onClick={() => setMenuSearchKeyword("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Auto Refresh Live Status / Toggle */}
        <button
          onClick={() => {
            const next = !autoRefreshEnabled;
            setAutoRefreshEnabled(next);
            if (next && silentRefresh) {
              silentRefresh();
            }
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            autoRefreshEnabled
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
              : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600"
          }`}
          title={
            autoRefreshEnabled
              ? "Auto-refresh active (every 15s) - Click to pause"
              : "Auto-refresh paused - Click to resume & sync"
          }
        >
          <span
            className={`w-2 h-2 rounded-full ${
              autoRefreshEnabled ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <span className="hidden sm:inline">
            {autoRefreshEnabled ? "Live (15s)" : "Paused"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default HeaderComponent;
