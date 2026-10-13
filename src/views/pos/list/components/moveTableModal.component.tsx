"use client";

import React, { useState } from "react";
import { usePOSStore, usePOSMutations } from "../../store/posStore";
import { POSListProps, POSTableType, IPosTableStatus, IEntityStatus } from "../../type/posType";
import { useSession } from "next-auth/react";

const MoveTableModalComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { dictionary: dic } = props;
  const { data: session } = useSession();

  const {
    moveTableModalOpen,
    setMoveTableModalOpen,
    selectedTable,
    currentOrder,
    tables,
    zones,
    transferTableAPI,
    actionLoading,
  } = usePOSStore();

  const { transferTableMutation } = usePOSMutations();

  const [selectedTargetTable, setSelectedTargetTable] = useState<POSTableType | null>(null);
  const [modalZoneId, setModalZoneId] = useState<string>(IEntityStatus.all);

  if (!moveTableModalOpen || !selectedTable || !currentOrder) return null;

  // Filter only AVAILABLE tables (excluding current table)
  const availableTables = tables.filter(
    (t) =>
      t._id !== selectedTable._id &&
      t.status === IPosTableStatus.available &&
      (modalZoneId === IEntityStatus.all || t.zoneId === modalZoneId)
  );

  const handleConfirmMove = async () => {
    if (!selectedTargetTable) return;

    const success = await transferTableAPI({
      currentTable: selectedTable,
      targetTable: selectedTargetTable,
      currentOrder,
      mutations: {
        transferTableMutation,
      },
    });

    if (success) {
      setSelectedTargetTable(null);
    }
  };

  const handleClose = () => {
    setSelectedTargetTable(null);
    setModalZoneId(IEntityStatus.all);
    setMoveTableModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2F57AB] to-[#1E3A8A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-lg">
              <i className="tabler-arrows-exchange" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {dic.posPage?.moveTableTitle ?? "Move / Transfer Table"}
              </h3>
              <p className="text-xs text-blue-200">
                {dic.posPage?.table ?? "Table"} {selectedTable.number} • {currentOrder.orderNumber}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Transfer Route Banner */}
          <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between gap-4">
            {/* Origin Table */}
            <div className="flex-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                {dic.posPage?.fromTable ?? "Current Table"}
              </span>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#2F57AB] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {selectedTable.number}
                </span>
                <div>
                  <div className="font-bold text-sm text-gray-800 dark:text-gray-100">
                    {selectedTable.number} {selectedTable.zoneName ? `(${selectedTable.zoneName})` : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentOrder.items?.length || 0} {dic.posPage?.items ?? "items"} • {(currentOrder.total || 0).toLocaleString()} ₭
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-[#2F57AB] dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-900 shrink-0">
              <i className="tabler-arrow-right text-base" />
            </div>

            {/* Target Table */}
            <div className="flex-1 text-right">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                {dic.posPage?.toTable ?? "Destination Table"}
              </span>
              {selectedTargetTable ? (
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      {selectedTargetTable.number} {selectedTargetTable.zoneName ? `(${selectedTargetTable.zoneName})` : ""}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cap: {selectedTargetTable.capacity}
                    </div>
                  </div>
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {selectedTargetTable.number}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-amber-600 dark:text-amber-400 italic">
                  {dic.posPage?.selectTargetTable ?? "Select an available table below"}
                </span>
              )}
            </div>
          </div>

          {/* Zone Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              {dic.posPage?.allZones ?? "Select Zone"}
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setModalZoneId(IEntityStatus.all)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  modalZoneId === IEntityStatus.all
                    ? "bg-[#2F57AB] text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                }`}
              >
                {dic.posPage?.allZones ?? "All Zones"}
              </button>
              {zones.map((zone) => (
                <button
                  key={zone._id}
                  type="button"
                  onClick={() => setModalZoneId(zone._id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    modalZoneId === zone._id
                      ? "bg-[#2F57AB] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* Available Tables Grid */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              {dic.posPage?.statusAvailable ?? "Available Tables"} ({availableTables.length})
            </label>

            {availableTables.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                <i className="tabler-armchair-off text-3xl mb-2 text-gray-300 dark:text-gray-600 block" />
                <p className="text-xs font-medium">
                  {dic.posPage?.noAvailableTables ?? "No available tables found to move to."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableTables.map((table) => {
                  const isSelected = selectedTargetTable?._id === table._id;

                  return (
                    <button
                      key={table._id}
                      type="button"
                      onClick={() => setSelectedTargetTable(table)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between h-24 ${
                        isSelected
                          ? "border-[#2F57AB] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#2F57AB]/40 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#2F57AB]/60 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {table.number}
                        </span>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-[#2F57AB] text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      <div>
                        <span className="text-[11px] text-gray-400 block truncate">
                          {table.zoneName || "Zone"}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Cap: {table.capacity}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {dic.posPage?.cancel ?? "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleConfirmMove}
            disabled={!selectedTargetTable || actionLoading}
            className="px-5 py-2 bg-[#2F57AB] hover:bg-[#25468a] text-white text-xs font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <i className={`tabler-arrows-exchange text-sm ${actionLoading ? "animate-spin" : ""}`} />
            <span>
              {actionLoading
                ? dic.posPage?.processing ?? "Processing..."
                : dic.posPage?.confirmMove ?? "Confirm Move Table"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveTableModalComponent;
