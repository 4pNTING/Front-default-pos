"use client";

import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useInventoryStore } from "../../store/inventoryStore";
import { InventoryListProps } from "../../type/inventoryType";
import { LOAD_STOCK_HISTORY } from "@/gql/queries/inventory";

export const StockHistoryModalComponent: React.FC<{ props: InventoryListProps }> = ({ props }) => {
  const { lang } = props;
  const isLao = lang === "la";

  const {
    isHistoryModalOpen,
    setHistoryModalOpen,
    selectedItem,
    stockHistory,
    historyLoading,
    loadStockHistoryAPI,
  } = useInventoryStore();

  const [loadHistoryCall] = useLazyQuery(LOAD_STOCK_HISTORY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (isHistoryModalOpen && selectedItem) {
      loadStockHistoryAPI({
        query: loadHistoryCall,
        input: {
          inventoryItemId: selectedItem._id,
          limit: 50,
        },
      });
    }
  }, [isHistoryModalOpen, selectedItem, loadHistoryCall, loadStockHistoryAPI]);

  if (!isHistoryModalOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              <i className="tabler-history" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isLao ? "ປະຫວັດການເຄື່ອນໄຫວສະຕັອກ" : "ประวัติการเคลื่อนไหวสต็อก"}
              </h3>
              <p className="text-xs text-blue-100">
                {selectedItem.name} • SKU: {selectedItem.sku || "-"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHistoryModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {historyLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <i className="tabler-loader animate-spin text-3xl mb-2 text-blue-500" />
              <p className="text-xs">{isLao ? "ກຳລັງໂຫຼດປະຫວັດ..." : "กำลังโหลดประวัติ..."}</p>
            </div>
          ) : stockHistory.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 text-center">
              <i className="tabler-clock-off text-4xl mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-xs font-semibold">
                {isLao ? "ຍັງບໍ່ມີປະຫວັດການເຄື່ອນໄຫວສຳລັບລາຍການນີ້" : "ยังไม่มีประวัติการเคลื่อนไหวสต็อก"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 text-gray-500 text-[11px] font-bold uppercase">
                    <th className="py-2.5 px-3">{isLao ? "ວັນທີ & ເວລາ" : "วันเวลา"}</th>
                    <th className="py-2.5 px-3">{isLao ? "ປະເພດ" : "ประเภท"}</th>
                    <th className="py-2.5 px-3 text-right">{isLao ? "ຈຳນວນ" : "จำนวน"}</th>
                    <th className="py-2.5 px-3 text-right">{isLao ? "ຍອດຄົງເຫຼືອ" : "คงเหลือ"}</th>
                    <th className="py-2.5 px-3">{isLao ? "ໝາຍເຫດ / ອ້າງອີງ" : "หมายเหตุ / อ้างอิง"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
                  {stockHistory.map((tx) => {
                    let typeBadgeClass = "bg-gray-100 text-gray-700 border-gray-300";
                    let typeLabel = tx.type;

                    if (tx.type === "IN") {
                      typeBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300";
                      typeLabel = isLao ? "ຮັບເຂົ້າ (Stock In)" : "รับเข้า";
                    } else if (tx.type === "OUT_SALE") {
                      typeBadgeClass = "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300";
                      typeLabel = isLao ? "ຕັດຂາຍ POS (Sale)" : "ตัดขาย POS";
                    } else if (tx.type === "WASTE") {
                      typeBadgeClass = "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300";
                      typeLabel = isLao ? "ຂອງເສຍ (Waste)" : "ของเสีย/ทิ้ง";
                    } else if (tx.type === "ADJUSTMENT") {
                      typeBadgeClass = "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300";
                      typeLabel = isLao ? "ປັບຍອດນັບຈິງ" : "ปรับยอดตรวจนับ";
                    }

                    const qtyNum = Number(tx.quantity) || 0;
                    let qtyPrefix = "";
                    if (qtyNum > 0) {
                      qtyPrefix = "+";
                    }

                    return (
                      <tr key={tx._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                        {/* Timestamp */}
                        <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}
                        </td>

                        {/* Type */}
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadgeClass}`}>
                            {typeLabel}
                          </span>
                        </td>

                        {/* Quantity change */}
                        <td className="py-3 px-3 text-right font-bold font-mono">
                          <span
                            className={
                              qtyNum > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : qtyNum < 0
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-gray-600"
                            }
                          >
                            {qtyPrefix}{qtyNum.toLocaleString()} {selectedItem.unit}
                          </span>
                        </td>

                        {/* Balance After */}
                        <td className="py-3 px-3 text-right font-extrabold font-mono text-gray-900 dark:text-white">
                          {Number(tx.balanceAfter || 0).toLocaleString()} {selectedItem.unit}
                        </td>

                        {/* Note */}
                        <td className="py-3 px-3 text-gray-500 text-[11px] max-w-xs truncate">
                          {tx.note || tx.orderId ? `Ref: ${tx.note || tx.orderId}` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="button"
            onClick={() => setHistoryModalOpen(false)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl transition-all"
          >
            {isLao ? "ປິດ (Close)" : "ปิด"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryModalComponent;
