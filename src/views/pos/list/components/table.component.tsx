"use client";

import React from "react";
import { usePOSStore } from "../../store/posStore";
import { POSListProps, POSTableType, IPosTableStatus, IEntityStatus } from "../../type/posType";

const TableComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  // Var
  const { lang, dictionary: dic } = props;

  const {
    tables,
    zones,
    selectedZoneId,
    setSelectedZoneId,
    selectedTable,
    selectTable,
    loading,
  } = usePOSStore();

  const filteredTables =
    selectedZoneId === IEntityStatus.all
      ? tables
      : tables.filter((t) => t.zoneId === selectedZoneId);

  const availableCount = tables.filter((t) => t.status === IPosTableStatus.available).length;
  const occupiedCount = tables.filter((t) => t.status === IPosTableStatus.occupied).length;
  const reservedCount = tables.filter((t) => t.status === IPosTableStatus.reserved).length;

  const handleTableClick = (table: POSTableType) => {
    selectTable(table);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Zone Tabs & Status Counters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Zone Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
          <button
            onClick={() => setSelectedZoneId(IEntityStatus.all)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedZoneId === IEntityStatus.all
                ? "bg-[#2F57AB] text-white shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2F57AB]"
            }`}
          >
            {dic.posPage?.allZones ?? "All Zones"} ({tables.length})
          </button>
          {zones.map((zone) => {
            const countInZone = tables.filter((t) => t.zoneId === zone._id).length;
            return (
              <button
                key={zone._id}
                onClick={() => setSelectedZoneId(zone._id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedZoneId === zone._id
                    ? "bg-[#2F57AB] text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2F57AB]"
                }`}
              >
                {zone.name} ({countInZone})
              </button>
            );
          })}
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{dic.posPage?.statusAvailable ?? "Available"}: {availableCount}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{dic.posPage?.statusOccupied ?? "Occupied"}: {occupiedCount}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{dic.posPage?.statusReserved ?? "Reserved"}: {reservedCount}</span>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      {loading && tables.length === 0 ? (
        <div className="flex justify-center items-center py-24 text-gray-400">
          <i className="tabler-loader animate-spin text-3xl mr-2" />
          <span>{dic.posPage?.loadingFloorPlan ?? "Loading table floor plan..."}</span>
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3 text-gray-400 dark:text-gray-500">
            <i className="tabler-armchair-off text-3xl" />
          </div>
          <p className="text-sm font-medium">{dic.posPage?.emptyZone ?? "No tables found in this zone."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredTables.map((table) => {
            const isSelected = selectedTable?._id === table._id;
            const isOccupied = table.status === IPosTableStatus.occupied;
            const isReserved = table.status === IPosTableStatus.reserved;
            const activeOrder = table.activeOrder;

            return (
              <div
                key={table._id}
                onClick={() => handleTableClick(table)}
                className={`relative group cursor-pointer rounded-xl p-4 transition-all duration-200 border flex flex-col justify-between select-none ${
                  isSelected
                    ? "ring-2 ring-[#2F57AB] shadow-md transform -translate-y-1"
                    : "hover:shadow-md hover:-translate-y-0.5"
                } ${
                  isOccupied
                    ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60"
                    : isReserved
                    ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Header: Table Number & Status Indicator */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      {table.zoneName ?? dic.posPage?.table ?? "Table"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                      {table.number}
                    </h3>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                      isOccupied
                        ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        : isReserved
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                        : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    }`}
                  />
                </div>

                {/* Body: Order Info or Capacity */}
                <div className="my-3 min-h-[46px] flex flex-col justify-center">
                  {isOccupied && activeOrder ? (
                    <div className="space-y-1 text-xs">
                      <div className="font-semibold text-rose-700 dark:text-rose-300 flex items-center justify-between">
                        <span>{activeOrder.orderNumber}</span>
                        <span>{activeOrder.items?.length ?? 0} {dic.posPage?.items ?? "items"}</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-200 font-bold text-sm">
                        {(activeOrder.total ?? 0).toLocaleString()} ₭
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1.5">
                      <i className="tabler-users text-sm" />
                      <span>{table.capacity} {dic.posPage?.seats ?? "seats"}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Status Badge & Action Hint */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold text-[11px] px-2 py-0.5 rounded-full capitalize ${
                      isOccupied
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200"
                        : isReserved
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                    }`}
                  >
                    {isOccupied
                      ? dic.posPage?.statusOccupied ?? table.status
                      : isReserved
                      ? dic.posPage?.statusReserved ?? table.status
                      : dic.posPage?.statusAvailable ?? table.status}
                  </span>

                  <span className="text-[11px] text-[#2F57AB] dark:text-blue-400 font-medium group-hover:underline flex items-center gap-0.5">
                    {dic.posPage?.orderNow ?? "Order"} <i className="tabler-chevron-right text-xs" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TableComponent;
