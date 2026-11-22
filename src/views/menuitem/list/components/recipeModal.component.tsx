"use client";

import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useInventoryStore, useInventoryMutations } from "../../../inventory/store/inventoryStore";
import { RecipeItemType } from "../../../inventory/type/inventoryType";
import { MenuItemType } from "../../type/menuItemType";
import { LOAD_RECIPE_BY_MENU_ITEM, LOAD_INVENTORY } from "@/gql/queries/inventory";
import { ToastService } from "@/utils/toastService";

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  menuItem: MenuItemType | null;
  lang: string;
}

export const RecipeModalComponent: React.FC<RecipeModalProps> = ({
  open,
  onClose,
  menuItem,
  lang,
}) => {
  const isLao = lang === "la";

  const {
    inventoryList,
    loadInventoryAPI,
    loadRecipeByMenuItemAPI,
    setMenuItemRecipeAPI,
    actionLoading,
  } = useInventoryStore();

  const { setMenuItemRecipeMutation } = useInventoryMutations();

  const [loadRecipeCall] = useLazyQuery(LOAD_RECIPE_BY_MENU_ITEM, {
    fetchPolicy: "network-only",
  });
  const [loadInventoryCall] = useLazyQuery(LOAD_INVENTORY, {
    fetchPolicy: "network-only",
  });

  const [recipes, setRecipes] = useState<RecipeItemType[]>([]);
  const [loading, setLoading] = useState(false);

  // New ingredient row state
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [quantity, setQuantity] = useState<string>("1");

  // Fetch recipe and inventory options on open
  useEffect(() => {
    if (open && menuItem) {
      setLoading(true);
      // Load inventory items if not already loaded
      if (inventoryList.length === 0) {
        loadInventoryAPI({ query: loadInventoryCall, input: { limit: 100 } });
      }

      loadRecipeByMenuItemAPI({
        query: loadRecipeCall,
        menuItemId: menuItem._id,
      })
        .then((data) => {
          setRecipes(data || []);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, menuItem, loadRecipeCall, loadInventoryCall, loadRecipeByMenuItemAPI, loadInventoryAPI, inventoryList.length]);

  if (!open || !menuItem) return null;

  // Add ingredient to local recipe list
  const handleAddIngredient = () => {
    if (!selectedInventoryId) {
      ToastService.warning(isLao ? "ກະລຸນາເລືອກວັດຖຸດິບ" : "กรุณาเลือกวัตถุดิบ");
      return;
    }

    const qtyNum = Number(quantity);
    if (qtyNum <= 0) {
      ToastService.warning(isLao ? "ກະລຸນາໃສ່ຈຳນວນທີ່ຖືກຕ້ອງ" : "กรุณาระบุปริมาณที่ถูกต้อง");
      return;
    }

    // Check if ingredient already exists in recipe
    const exists = recipes.some((r) => r.inventoryItemId === selectedInventoryId);
    if (exists) {
      ToastService.warning(isLao ? "ວັດຖຸດິບນີ້ມີໃນສູດແລ້ວ" : "วัตถุดิบนี้มีอยู่ในสูตรแล้ว");
      return;
    }

    const matchedItem = inventoryList.find((i) => i._id === selectedInventoryId);

    const newRecipeItem: RecipeItemType = {
      menuItemId: menuItem._id,
      inventoryItemId: selectedInventoryId,
      quantityRequired: qtyNum,
      inventoryItem: matchedItem ? {
        _id: matchedItem._id,
        name: matchedItem.name,
        unit: matchedItem.unit,
        currentStock: matchedItem.currentStock,
        costPerUnit: matchedItem.costPerUnit,
      } : undefined,
    };

    setRecipes((prev) => [...prev, newRecipeItem]);
    setSelectedInventoryId("");
    setQuantity("1");
  };

  // Remove ingredient row
  const handleRemoveIngredient = (inventoryId: string) => {
    setRecipes((prev) => prev.filter((r) => r.inventoryItemId !== inventoryId));
  };

  // Update quantity on row
  const handleUpdateQty = (inventoryId: string, newQty: number) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.inventoryItemId === inventoryId) {
          return { ...r, quantityRequired: newQty };
        }
        return r;
      })
    );
  };

  // Calculate Food Cost
  const totalFoodCost = recipes.reduce((sum, r) => {
    const cost = r.inventoryItem?.costPerUnit || 0;
    return sum + (r.quantityRequired * cost);
  }, 0);

  const price = Number(menuItem.price) || 0;
  const grossMargin = price - totalFoodCost;
  let marginPercent = 0;
  if (price > 0) {
    marginPercent = Math.round((grossMargin / price) * 100);
  }

  // Save recipe
  const handleSaveRecipe = async () => {
    const payload = {
      menuItemId: menuItem._id,
      ingredients: recipes.map((r) => ({
        inventoryItemId: r.inventoryItemId,
        quantityRequired: Number(r.quantityRequired) || 0,
      })),
    };

    const success = await setMenuItemRecipeAPI({
      mutation: setMenuItemRecipeMutation,
      input: payload,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              <i className="tabler-chef-hat" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isLao ? "ສູດອາຫານ & ຕັດສະຕັອກວັດຖຸດິບ" : "สูตรอาหาร & การตัดสต็อกวัตถุดิบ (Recipe BOM)"}
              </h3>
              <p className="text-xs text-blue-100">
                {menuItem.name} • {price.toLocaleString()} ₭
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Cost & Profit Analysis Box */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">
                {isLao ? "ລາຄາຂາຍໜ້າຮ້ານ" : "ราคาขายหน้าร้าน"}
              </span>
              <span className="text-base font-extrabold text-gray-900 dark:text-white font-mono">
                {price.toLocaleString()} ₭
              </span>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider block">
                {isLao ? "ຕົ້ນທຶນອາຫານ (Food Cost)" : "ต้นทุนวัตถุดิบรวม"}
              </span>
              <span className="text-base font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                {totalFoodCost.toLocaleString()} ₭
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider block">
                {isLao ? "ກຳໄລຂັ້ນຕົ້ນ (Margin)" : "กำไรขั้นต้น / จาน"}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                  {grossMargin.toLocaleString()} ₭
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  ({marginPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Add Ingredient Section */}
          <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              {isLao ? "+ ເພີ່ມວັດຖຸດິບເຂົ້າໃນສູດອາຫານນີ້" : "+ เพิ่มวัตถุดิบเข้าในสูตรอาหารนี้"}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedInventoryId}
                onChange={(e) => setSelectedInventoryId(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
              >
                <option value="">
                  {isLao ? "-- ເລືອກວັດຖຸດິບຈາກສາງ --" : "-- เลือกวัตถุดิบจากคลัง --"}
                </option>
                {inventoryList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} ({item.currentStock} {item.unit} in stock)
                  </option>
                ))}
              </select>

              <div className="w-28 relative">
                <input
                  type="number"
                  step="any"
                  min="0.001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Qty"
                  className="w-full text-xs font-mono font-bold px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-xs"
              >
                <i className="tabler-plus text-sm" />
                <span>{isLao ? "ເພີ່ມ" : "เพิ่ม"}</span>
              </button>
            </div>
          </div>

          {/* Recipe Ingredients Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 text-gray-500 text-[11px] font-bold uppercase">
                  <th className="py-2.5 px-3">{isLao ? "ວັດຖຸດິບ" : "วัตถุดิบ"}</th>
                  <th className="py-2.5 px-3 text-center">{isLao ? "ປະລິມານທີ່ໃຊ້/ຈານ" : "ปริมาณที่ใช้ / จาน"}</th>
                  <th className="py-2.5 px-3 text-right">{isLao ? "ຕົ້ນທຶນ/ຈານ" : "ต้นทุน / จาน"}</th>
                  <th className="py-2.5 px-3 text-center">{isLao ? "ລົບ" : "ลบ"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
                {recipes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      {isLao
                        ? "ຍັງບໍ່ໄດ້ກຳນົດສູດວັດຖຸດິບສຳລັບເມນູນີ້"
                        : "ยังไม่ได้ผูกสูตรวัตถุดิบสำหรับเมนูนี้"}
                    </td>
                  </tr>
                ) : (
                  recipes.map((r) => {
                    const item = r.inventoryItem;
                    const cost = (r.quantityRequired * (item?.costPerUnit || 0));
                    return (
                      <tr key={r.inventoryItemId} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                        <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">
                          <div>{item?.name || "Unknown Item"}</div>
                          <div className="text-[10px] text-gray-400">
                            Stock: {item?.currentStock || 0} {item?.unit}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              step="any"
                              min="0.001"
                              value={r.quantityRequired}
                              onChange={(e) => handleUpdateQty(r.inventoryItemId, Number(e.target.value) || 0)}
                              className="w-16 text-center text-xs font-mono font-bold py-1 px-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                            />
                            <span className="text-[11px] text-gray-500 font-bold">{item?.unit}</span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900 dark:text-white">
                          {cost.toLocaleString()} ₭
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(r.inventoryItemId)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <i className="tabler-trash text-sm" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            {isLao
              ? "ເມື່ອຂາຍເມນູນີ້ໃນ POS ລະບົບຈະຕັດສະຕັອກຕາມອັດຕາສ່ວນນີ້ອັດຕະໂນມັດ"
              : "เมื่อออเดอร์ใน POS ชำระเงินสำเร็จ ระบบจะตัดสต็อกวัตถุดิบตามสัดส่วนนี้อัตโนมัติ"}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {isLao ? "ຍົກເລີກ" : "ยกเลิก"}
            </button>
            <button
              type="button"
              onClick={handleSaveRecipe}
              disabled={actionLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <i className={`tabler-check text-sm ${actionLoading ? "animate-spin" : ""}`} />
              <span>{isLao ? "ບັນທຶກສູດອາຫານ" : "บันทึกสูตรอาหาร"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModalComponent;
