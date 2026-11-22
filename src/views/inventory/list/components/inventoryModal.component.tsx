"use client";

import React, { useState, useEffect } from "react";
import { useInventoryStore, useInventoryMutations } from "../../store/inventoryStore";
import { InventoryListProps } from "../../type/inventoryType";
import { ToastService } from "@/utils/toastService";

export const InventoryModalComponent: React.FC<{ props: InventoryListProps }> = ({ props }) => {
  const { lang } = props;
  const isLao = lang === "la";

  const {
    isCreateModalOpen,
    setCreateModalOpen,
    isEditModalOpen,
    setEditModalOpen,
    selectedItem,
    createInventoryItemAPI,
    updateInventoryItemAPI,
    actionLoading,
  } = useInventoryStore();

  const { createInventoryItemMutation, updateInventoryItemMutation } = useInventoryMutations();

  const isEdit = isEditModalOpen && Boolean(selectedItem);
  const isOpen = isCreateModalOpen || isEditModalOpen;

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("meat");
  const [unit, setUnit] = useState("kg");
  const [currentStock, setCurrentStock] = useState<string>("0");
  const [minStockAlert, setMinStockAlert] = useState<string>("5");
  const [costPerUnit, setCostPerUnit] = useState<string>("0");
  const [isActive, setIsActive] = useState("1");

  useEffect(() => {
    if (isEdit && selectedItem) {
      setName(selectedItem.name || "");
      setSku(selectedItem.sku || "");
      setCategory(selectedItem.category || "meat");
      setUnit(selectedItem.unit || "kg");
      setCurrentStock(selectedItem.currentStock?.toString() || "0");
      setMinStockAlert(selectedItem.minStockAlert?.toString() || "5");
      setCostPerUnit(selectedItem.costPerUnit?.toString() || "0");
      setIsActive(selectedItem.isActive || "1");
    } else {
      setName("");
      setSku("");
      setCategory("meat");
      setUnit("kg");
      setCurrentStock("0");
      setMinStockAlert("5");
      setCostPerUnit("0");
      setIsActive("1");
    }
  }, [isEdit, selectedItem, isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      ToastService.warning(isLao ? "ກະລຸນາໃສ່ຊື່ວັດຖຸດິບ" : "กรุณาระบุชื่อวัตถุดิบ");
      return;
    }

    if (isEdit && selectedItem) {
      await updateInventoryItemAPI({
        mutation: updateInventoryItemMutation,
        input: {
          _id: selectedItem._id,
          name: name.trim(),
          sku: sku.trim(),
          category,
          unit,
          minStockAlert: Number(minStockAlert) || 0,
          costPerUnit: Number(costPerUnit) || 0,
          isActive,
        },
      });
    } else {
      await createInventoryItemAPI({
        mutation: createInventoryItemMutation,
        input: {
          name: name.trim(),
          sku: sku.trim(),
          category,
          unit,
          currentStock: Number(currentStock) || 0,
          minStockAlert: Number(minStockAlert) || 0,
          costPerUnit: Number(costPerUnit) || 0,
          isActive,
        },
      });
    }
  };

  const categories = [
    { id: "meat", name: isLao ? "ຊີ້ນ / ຊີ້ນສັດ (Meat)" : "เนื้อสัตว์" },
    { id: "seafood", name: isLao ? "ອາຫານທະເລ (Seafood)" : "อาหารทะเล" },
    { id: "vegetable", name: isLao ? "ຜັກ & ໝາກໄມ້ (Vegetables)" : "ผัก & ผลไม้" },
    { id: "seasoning", name: isLao ? "ເຄື່ອງປຸງ & ຊອດ (Seasoning)" : "เครื่องปรุง & ซอส" },
    { id: "beverage", name: isLao ? "ເຄື່ອງດື່ມ (Beverage)" : "เครื่องดื่ม" },
    { id: "dry_food", name: isLao ? "ອາຫານແຫ້ງ (Dry Food)" : "อาหารแห้ง" },
    { id: "packaging", name: isLao ? "ກ່ອງ & ຖົງ (Packaging)" : "บรรจุภัณฑ์" },
  ];

  const commonUnits = ["kg", "g", "l", "ml", "pcs", "bottle", "can", "pack", "box"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              <i className={isEdit ? "tabler-edit" : "tabler-plus"} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isEdit
                  ? isLao ? "ແກ້ໄຂຂໍ້ມູນວັດຖຸດິບ" : "แก้ไขข้อมูลสินค้า/วัตถุดิบ"
                  : isLao ? "ເພີ່ມວັດຖຸດິບໃໝ່ເຂົ້າສາງ" : "เพิ่มสินค้า/วัตถุดิบใหม่เข้าคลัง"}
              </h3>
              <p className="text-xs text-blue-100">
                {isLao
                  ? "ກຳນົດຊື່, ໝວດໝູ່, ໜ່ວຍນັບ, ຈຸດເຕືອນສະຕັອກ ແລະ ຕົ້ນທຶນ"
                  : "ระบุชื่อ, หมวดหมู่, หน่วยนับ, จุดเตือนสต็อก และต้นทุน"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Item Name */}
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
              {isLao ? "ຊື່ວັດຖຸດິບ / ສິນຄ້າ *" : "ชื่อสินค้า / วัตถุดิบ *"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isLao ? "ຕົວຢ່າງ: ຊີ້ນໝູສັນຄໍ, ນົມສົດ, ເບຍລາວ" : "ตัวอย่าง: เนื้อหมูสันคอ, นมสด, เบียร์สิงห์"}
              className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600 transition-all font-semibold"
            />
          </div>

          {/* SKU & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                SKU / Barcode
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-1001"
                className="w-full text-xs font-mono px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                {isLao ? "ໝວດໝູ່ *" : "หมวดหมู่วัตถุดิบ *"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit & Initial Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                {isLao ? "ໜ່ວຍນັບ *" : "หน่วยนับ *"}
              </label>
              <input
                type="text"
                list="unit-suggestions"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg, g, pcs, bottle..."
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600 font-medium"
              />
              <datalist id="unit-suggestions">
                {commonUnits.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            {!isEdit ? (
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                  {isLao ? "ຍອດສະຕັອກເລີ່ມຕົ້ນ" : "สต็อกเริ่มต้น"}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value)}
                  className="w-full text-xs font-mono font-bold px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                  {isLao ? "ຍອດສະຕັອກປະຈຸບັນ" : "ยอดสต็อกปัจจุบัน"}
                </label>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700/60 rounded-xl text-xs font-bold font-mono text-gray-700 dark:text-gray-200">
                  {selectedItem?.currentStock} {selectedItem?.unit}
                </div>
              </div>
            )}
          </div>

          {/* Min Stock Alert & Cost Per Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                {isLao ? "ຈຸດເຕືອນສະຕັອກໃກ້ໝົດ (Min Alert)" : "จุดเตือนสต็อกขั้นต่ำ"}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                {isLao ? "ລະບົບຈະແຈ້ງເຕືອນເມື່ອຕ່ຳກວ່ານີ້" : "แจ้งเตือนเมื่อสต็อกเหลือน้อยกว่านี้"}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 block">
                {isLao ? "ຕົ້ນທຶນຕໍ່ໜ່ວຍ (₭)" : "ต้นทุนเฉลี่ยต่อหน่วย (₭)"}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
                className="w-full text-xs font-mono font-bold px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                {isLao ? "ໃຊ້ຄຳນວນມູນຄ່າສາງ & Food Cost" : "ใช้คำนวณมูลค่าสต็อกและ Food Cost"}
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
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
                  : isLao ? "ບັນທຶກຂໍ້ມູນ" : "บันทึกข้อมูล"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModalComponent;
