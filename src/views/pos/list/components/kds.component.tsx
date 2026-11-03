"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { usePOSStore, usePOSMutations } from "../../store/posStore";
import { OrderType, POSListProps, IPosOrderStatus } from "../../type/posType";
import { Button, Chip, Tooltip } from "@mui/material";

export const KdsComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { lang, dictionary: dic } = props;
  const { updateOrderStatusMutation } = usePOSMutations();
  const {
    activeOrders,
    tables,
    categories,
    updateOrderStatusAPI,
    silentRefresh,
  } = usePOSStore();

  const [statusFilter, setStatusFilter] = useState<string>("cooking_active");
  const [stationFilter, setStationFilter] = useState<string>("all");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live timer tick every second
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const prevOrdersCountRef = useRef(activeOrders.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Soft Web Audio chime when a new order appears
  const playNewOrderChime = useCallback(() => {
    if (typeof window === "undefined" || !audioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // Ignored if browser blocks audio before interaction
    }
  }, [audioEnabled]);

  // Detect incoming new orders and chime
  useEffect(() => {
    if (activeOrders.length > prevOrdersCountRef.current) {
      playNewOrderChime();
    }
    prevOrdersCountRef.current = activeOrders.length;
  }, [activeOrders.length, playNewOrderChime]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Helper: map tableId to table info
  const getTableInfo = (tableId: string) => {
    return tables.find((t) => t._id === tableId);
  };

  // Helper: Elapsed time counter and urgency level
  const getElapsedTime = (createdAt?: string) => {
    if (!createdAt) {
      return { text: "00:00", minutes: 0, level: "fresh" as const };
    }
    const createdTime = new Date(createdAt).getTime();
    const diffSec = Math.max(0, Math.floor((currentTime - createdTime) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    const padMins = String(mins).padStart(2, "0");
    const padSecs = String(secs).padStart(2, "0");

    let level: "fresh" | "warning" | "urgent" = "fresh";
    if (mins >= 20) {
      level = "urgent";
    } else if (mins >= 10) {
      level = "warning";
    }

    return {
      text: `${padMins}:${padSecs}`,
      minutes: mins,
      level,
    };
  };

  // Filter orders for KDS
  const filteredOrders = useMemo(() => {
    return activeOrders.filter((order) => {
      // Status filter
      if (statusFilter === "cooking_active") {
        if (order.status === IPosOrderStatus.paid || order.status === IPosOrderStatus.cancelled) {
          return false;
        }
      } else if (statusFilter === IPosOrderStatus.preparing) {
        if (order.status !== IPosOrderStatus.preparing && order.status !== "cooking") {
          return false;
        }
      } else if (statusFilter === IPosOrderStatus.confirmed) {
        if (order.status !== IPosOrderStatus.confirmed && order.status !== IPosOrderStatus.pending) {
          return false;
        }
      } else if (statusFilter === IPosOrderStatus.served) {
        if (order.status !== IPosOrderStatus.served) {
          return false;
        }
      }

      // Station filter (if category filter applied)
      if (stationFilter !== "all") {
        const hasMatchingItem = (order.items || []).some((item: any) => {
          return item.categoryId === stationFilter;
        });
        if (!hasMatchingItem) {
          return false;
        }
      }

      return true;
    });
  }, [activeOrders, statusFilter, stationFilter]);

  // Toggle item check-off strike-through
  const toggleItemCheck = (orderId: string, itemId: string) => {
    const key = `${orderId}_${itemId}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Advance Order Status from Kitchen
  const handleUpdateStatus = async (order: OrderType, newStatus: string) => {
    await updateOrderStatusAPI({
      orderId: order._id,
      status: newStatus,
      mutation: updateOrderStatusMutation,
    });
    if (silentRefresh) {
      await silentRefresh();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-100 overflow-hidden">
      {/* KDS Top Bar */}
      <div className="bg-[#1e293b] border-b border-slate-700/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
              <i className="tabler-tools-kitchen-2 text-lg" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm md:text-base text-white tracking-wide">
                {lang === "la" ? "ໜ້າຈໍສະແດງຜົນໃນຄົວ (KDS)" : "Kitchen Display System"}
              </h2>
              <span className="text-[11px] text-slate-400 block">
                {lang === "la" ? "ອັບເດດສະຖານະການປຸງແຕ່ງແບບ Real-time" : "Real-time kitchen order dispatch"}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            <Chip
              label={`${filteredOrders.length} ${lang === "la" ? "ອໍເດີ" : "Tickets"}`}
              color="warning"
              size="small"
              sx={{ fontWeight: 800, fontSize: "11px" }}
            />
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-700">
            <button
              onClick={() => setStatusFilter("cooking_active")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                statusFilter === "cooking_active"
                  ? "bg-orange-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang === "la" ? "ທັງໝົດທີ່ຕ້ອງປຸງ" : "All Active"}
            </button>
            <button
              onClick={() => setStatusFilter(IPosOrderStatus.confirmed)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                statusFilter === IPosOrderStatus.confirmed
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang === "la" ? "ອໍເດີໃໝ່" : "New / Pending"}
            </button>
            <button
              onClick={() => setStatusFilter(IPosOrderStatus.preparing)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                statusFilter === IPosOrderStatus.preparing
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang === "la" ? "ກຳລັງປຸງ" : "Cooking"}
            </button>
            <button
              onClick={() => setStatusFilter(IPosOrderStatus.served)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                statusFilter === IPosOrderStatus.served
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {lang === "la" ? "ເສີບແລ້ວ" : "Served"}
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg border text-sm transition-all ${
              audioEnabled
                ? "bg-slate-800 border-slate-600 text-emerald-400 hover:bg-slate-700"
                : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
            }`}
            title={audioEnabled ? "Sound alert ON" : "Sound alert MUTED"}
          >
            <i className={audioEnabled ? "tabler-volume" : "tabler-volume-off"} />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-all"
            title="Toggle Fullscreen"
          >
            <i className={isFullscreen ? "tabler-minimize" : "tabler-maximize"} />
          </button>
        </div>
      </div>

      {/* Tickets Board Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16">
            <i className="tabler-soup text-6xl mb-3 text-slate-600" />
            <h3 className="font-bold text-lg text-slate-300 mb-1">
              {lang === "la" ? "ບໍ່ມີອໍເດີຄົງຄ້າງໃນຄົວ" : "Kitchen Queue is Clear!"}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs text-center">
              {lang === "la"
                ? "ທຸກລາຍການອາຫານຖືກປຸງແຕ່ງ ແລະ ເສີບຄົບຖ້ວນແລ້ວ"
                : "All orders have been prepared and served. New orders will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.map((order) => {
              const table = getTableInfo(order.tableId);
              const elapsed = getElapsedTime(order.createdAt);
              const items = order.items || [];

              // Status badges & colors
              let headerBg = "bg-slate-800 border-slate-700";
              let timerBadgeColor = "bg-emerald-950 text-emerald-300 border-emerald-800";

              if (elapsed.level === "urgent") {
                timerBadgeColor = "bg-rose-950 text-rose-300 border-rose-700 animate-pulse font-extrabold";
              } else if (elapsed.level === "warning") {
                timerBadgeColor = "bg-amber-950 text-amber-300 border-amber-700 font-bold";
              }

              if (order.status === IPosOrderStatus.preparing || order.status === "cooking") {
                headerBg = "bg-amber-950/40 border-amber-600/70";
              } else if (order.status === IPosOrderStatus.served) {
                headerBg = "bg-emerald-950/40 border-emerald-600/70 opacity-80";
              } else if (order.status === IPosOrderStatus.pending || order.status === IPosOrderStatus.confirmed) {
                headerBg = "bg-blue-950/40 border-blue-600/70";
              }

              return (
                <div
                  key={order._id}
                  className={`flex flex-col rounded-2xl border-2 overflow-hidden shadow-lg transition-all ${headerBg}`}
                >
                  {/* Card Header */}
                  <div className="p-3.5 border-b border-slate-700/80 bg-slate-900/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg text-white">
                          {dic.posPage?.table ?? "Table"} {table?.number || "-"}
                        </span>
                        {table?.zoneName && (
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                            {table.zoneName}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        {order.orderNumber}
                      </span>
                    </div>

                    {/* Timer Badge */}
                    <div className="flex flex-col items-end">
                      <div className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 ${timerBadgeColor}`}>
                        <i className="tabler-clock text-xs" />
                        <span className="font-mono">{elapsed.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                  </div>

                  {/* Special Note Highlight Banner (e.g. Allergies, Custom requests) */}
                  {order.note && (
                    <div className="px-3.5 py-2 bg-amber-500/20 border-b border-amber-500/30 flex items-start gap-1.5 text-xs text-amber-300 font-semibold">
                      <i className="tabler-alert-triangle text-base text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.note}</span>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="p-3.5 flex-1 space-y-2.5 overflow-y-auto max-h-[300px]">
                    {items.map((item, idx) => {
                      const itemKey = `${order._id}_${item._id || idx}`;
                      const isChecked = !!checkedItems[itemKey];

                      return (
                        <div
                          key={itemKey}
                          onClick={() => toggleItemCheck(order._id, item._id || String(idx))}
                          className={`p-2 rounded-xl border flex items-start justify-between gap-2 cursor-pointer transition-all ${
                            isChecked
                              ? "bg-slate-900/40 border-slate-800 opacity-40 line-through"
                              : "bg-slate-800/80 border-slate-700/80 hover:border-slate-500"
                          }`}
                        >
                          <div className="flex items-start gap-2 flex-1">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="mt-1 w-4 h-4 rounded border-slate-600 text-orange-600 focus:ring-0 cursor-pointer"
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-100 leading-tight">
                                {item.menuItemName}
                              </div>
                              {item.note && (
                                <span className="text-[11px] text-amber-300 font-medium block mt-0.5">
                                  ↳ {item.note}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="px-2 py-0.5 rounded-lg bg-orange-600/30 border border-orange-500/50 text-orange-300 font-extrabold text-sm">
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 border-t border-slate-700/80 bg-slate-900/60 flex items-center gap-2">
                    {/* Status 1: Pending or Confirmed -> Start Cooking */}
                    {(order.status === IPosOrderStatus.pending || order.status === IPosOrderStatus.confirmed) && (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleUpdateStatus(order, IPosOrderStatus.preparing)}
                        sx={{
                          backgroundColor: "#d97706",
                          py: 1,
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "10px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#b45309" },
                        }}
                        startIcon={<i className="tabler-flame text-base" />}
                      >
                        {lang === "la" ? "ເລີ່ມປຸງແຕ່ງ (Start Cooking)" : "Start Cooking"}
                      </Button>
                    )}

                    {/* Status 2: Cooking -> Ready to Serve */}
                    {(order.status === IPosOrderStatus.preparing || order.status === "cooking") && (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleUpdateStatus(order, IPosOrderStatus.served)}
                        sx={{
                          backgroundColor: "#059669",
                          py: 1,
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "10px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#047857" },
                        }}
                        startIcon={<i className="tabler-bell-ringing text-base" />}
                      >
                        {lang === "la" ? "ປຸງແລ້ວ / ພ້ອມເສີບ (Ready to Serve)" : "Ready to Serve"}
                      </Button>
                    )}

                    {/* Status 3: Served */}
                    {order.status === IPosOrderStatus.served && (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <i className="tabler-check text-sm" />
                          {lang === "la" ? "ເສີບຮຽບຮ້ອຍແລ້ວ" : "Served"}
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(order, IPosOrderStatus.preparing)}
                          className="text-[11px] text-slate-400 hover:text-white underline"
                        >
                          {lang === "la" ? "ປ່ຽນກັບເປັນກຳລັງປຸງ" : "Recall"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KdsComponent;
