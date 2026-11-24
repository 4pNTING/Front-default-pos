"use client";

import React from "react";
import { useInventoryStore } from "../../store/inventoryStore";
import { InventoryListProps } from "../../type/inventoryType";

export const HeaderComponent: React.FC<{ props: InventoryListProps; onRefresh: () => void }> = ({
  props,
  onRefresh,
}) => {
  const { lang } = props;
  const isLao = lang === "la";

  const {
    selectedCategory,
    setSelectedCategory,
    searchKeyword,
    setSearchKeyword,
    setCreateModalOpen,
    lowStockItems,
    loading,
  } = useInventoryStore();

  const categories = [
    { id: "all", name: isLao ? "ທັງໝົດ (All)" : "ทั้งหมด" },
    { id: "meat", name: isLao ? "ຊີ້ນ / ຊີ້ນສັດ (Meat)" : "เนื้อสัตว์" },
    { id: "seafood", name: isLao ? "ອາຫານທະເລ (Seafood)" : "อาหารทะเล" },
    { id: "vegetable", name: isLao ? "ຜັກ & ໝາກໄມ້ (Vegetables)" : "ผัก & ผลไม้" },
    { id: "seasoning", name: isLao ? "ເຄື່ອງປຸງ & ຊອດ (Seasoning)" : "เครื่องปรุง & ซอส" },
    { id: "beverage", name: isLao ? "ເຄື່ອງດື່ມ (Beverage)" : "เครื่องดื่ม" },
    { id: "dry_food", name: isLao ? "ອາຫານແຫ້ງ (Dry Food)" : "อาหารแห้ง" },
    { id: "packaging", name: isLao ? "ກ່ອງ & ຖົງ (Packaging)" : "บรรจุภัณฑ์" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-3.5">
      {/* Top row: Title, Search, and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title and Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
            <i className="tabler-packages" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
              {isLao ? "ຈັດການສາງ & ວັດຖຸດິບ (Inventory Management)" : "จัดการคลังสินค้า & วัตถุดิบ"}
            </h2>
            <p className="text-xs text-gray-500">
              {isLao
                ? "ກວດສອບສະຕັອກ, ຮັບເຄື່ອງເຂົ້າ, ຕັດສະຕັອກອັດຕະໂນມັດຈາກການຂາຍ"
                : "ตรวจสอบสต็อกคงเหลือ, ปรับยอด, และตัดสต็อกอัตโนมัติตามสูตรอาหาร"}
            </p>
          </div>
        </div>

        {/* Actions: Add New Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <i className="tabler-plus text-base" />
            <span>{isLao ? "ເພີ່ມວັດຖຸດິບໃໝ່" : "เพิ่มวัตถุดิบใหม่"}</span>
          </button>
        </div>
      </div>

      {/* Second row: Search & Category Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-gray-100 dark:border-gray-700/60">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <i className="tabler-search absolute left-3 top-2.5 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder={isLao ? "ຄົ້ນຫາຊື່ວັດຖຸດິບ ຫຼື SKU..." : "ค้นหาชื่อวัตถุดิบ หรือ SKU..."}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 transition-all"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword("")}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "bg-gray-100 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
