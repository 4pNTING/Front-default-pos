"use client";

import React, { useState } from "react";
import { useInventoryStore, useInventoryMutations } from "../../store/inventoryStore";
import { InventoryListProps } from "../../type/inventoryType";
import { ToastService } from "@/utils/toastService";

export const AdjustStockModalComponent: React.FC<{ props: InventoryListProps }> = ({ props }) => {
  const { lang } = props;
  const isLao = lang === "la";

  const {
    isAdjustModalOpen,
    setAdjustModalOpen,
    selectedItem,
    adjustStockAPI,
    actionLoading,
  } = useInventoryStore();

  const { adjustStockMutation } = useInventoryMutations();

  const [type, setType] = useState<"IN" | "WASTE" | "ADJUSTMENT">("IN");
  const [quantity, setQuantity] = useState<string>("");
  const [note, setNote] = useState<string>("");

  if (!isAdjustModalOpen || !selectedItem) return null;

  const currentStock = Number(selectedItem.currentStock) || 0;
  const qtyNumber = Number(quantity) || 0;

  // Calculate projected balance after adjustment
  let projectedBalance = currentStock;
  if (type === "IN") {
    projectedBalance = currentStock + qtyNumber;
  } else if (type === "WASTE") {
    projectedBalance = Math.max(0, currentStock - qtyNumber);
  } else if (type === "ADJUSTMENT") {
    projectedBalance = qtyNumber; // Set directly to counted stock
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qtyNumber <= 0 && type !== "ADJUSTMENT") {
      ToastService.warning(isLao ? "ກະລຸນາໃສ່ຈຳນວນທີ່ຖືກຕ້ອງ" : "กรุณาระบุจำนวนที่ถูกต้อง");
      return;
    }

    let payloadQty = qtyNumber;
    if (type === "ADJUSTMENT") {
      // Calculate delta for backend
      payloadQty = qtyNumber - currentStock;
    }

    const success = await adjustStockAPI({
      mutation: adjustStockMutation,
      input: {
        inventoryItemId: selectedItem._id,
        type,
        quantity: payloadQty,
        note: note.trim() || undefined,
      },
    });

    if (success) {
      setQuantity("");
      setNote("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              <i className="tabler-arrows-up-down" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isLao ? "ປັບຍອດສະຕັອກ (Adjust Stock)" : "ปรับยอดสต็อก / รับของเข้า"}
              </h3>
              <p className="text-xs text-blue-100">
                {selectedItem.name} ({selectedItem.unit})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAdjustModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Stock Banner */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider block">
                {isLao ? "ຍອດຄົງເຫຼືອປະຈຸບັນ" : "ยอดคงเหลือปัจจุบัน"}
              </span>
              <span className="text-xl font-black text-gray-900 dark:text-white font-mono">
                {currentStock.toLocaleString()} {selectedItem.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-500 block">
                {isLao ? "ຫຼັງການປັບຍອດ" : "ยอดหลังการปรับ"}
              </span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {projectedBalance.toLocaleString()} {selectedItem.unit}
              </span>
            </div>
          </div>

          {/* Adjustment Type Selector */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">
              {isLao ? "ປະເພດການປັບຍອດ *" : "ประเภทรายการ *"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Type: IN */}
              <button
                type="button"
                onClick={() => setType("IN")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  type === "IN"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                }`}
              >
                <i className="tabler-arrow-down-left text-base text-emerald-600" />
                <span>{isLao ? "ຮັບເຂົ້າ (Stock In)" : "รับเข้า / ซื้อเพิ่ม"}</span>
              </button>

              {/* Type: WASTE */}
              <button
                type="button"
                onClick={() => setType("WASTE")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  type === "WASTE"
                    ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-300 shadow-xs"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                }`}
              >
                <i className="tabler-trash text-base text-rose-600" />
                <span>{isLao ? "ຂອງເສຍ (Waste)" : "ของเสีย / ทิ้ง"}</span>
              </button>

              {/* Type: ADJUSTMENT */}
              <button
                type="button"
                onClick={() => setType("ADJUSTMENT")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  type === "ADJUSTMENT"
                    ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300 shadow-xs"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                }`}
              >
                <i className="tabler-clipboard-check text-base text-blue-600" />
                <span>{isLao ? "ນັບຈິງ (Count)" : "ปรับยอดนับจริง"}</span>
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
              {type === "ADJUSTMENT"
                ? isLao ? "ຈຳນວນທີ່ນັບໄດ້ຕົວຈິງ *" : "จำนวนสต็อกที่ตรวจนับได้จริง *"
                : isLao ? "ຈຳນວນທີ່ປ່ຽນແປງ *" : "จำนวนที่เพิ่ม/ลด *"}
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full text-base font-mono font-black pl-3.5 pr-14 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-gray-400">
                {selectedItem.unit}
              </span>
            </div>
          </div>

          {/* Reason / Note */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
              {isLao ? "ໝາຍເຫດ / ເຫດຜົນ" : "หมายเหตุ / เอกสารอ้างอิง"}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isLao
                  ? "ຕົວຢ່າງ: ຊື້ເພີ່ມຈາກຕະຫຼາດ, ໝົດອາຍຸ, ນັບປະຈຳເດືອນ"
                  : "ตัวอย่าง: ซื้อเพิ่มจากตลาดสด, เสียหาย, ตรวจนับสต็อกประจำสัปดาห์"
              }
              className="w-full text-xs px-3.5 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdjustModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {isLao ? "ຍົກເລີກ" : "ยกเลิก"}
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <i className={`tabler-check text-sm ${actionLoading ? "animate-spin" : ""}`} />
              <span>
                {actionLoading
                  ? isLao ? "ກຳລັງບັນທຶກ..." : "กำลังบันทึก..."
                  : isLao ? "ຢືນຢັນການປັບຍອດ" : "ยืนยันการปรับสต็อก"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModalComponent;
