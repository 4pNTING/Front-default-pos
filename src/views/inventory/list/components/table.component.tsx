"use client";

import React from "react";
import Swal from "sweetalert2";
import { useInventoryStore, useInventoryMutations } from "../../store/inventoryStore";
import { InventoryListProps, InventoryItemType } from "../../type/inventoryType";

export const TableComponent: React.FC<{ props: InventoryListProps }> = ({ props }) => {
  const { lang } = props;
  const isLao = lang === "la";

  const {
    inventoryList,
    loading,
    setEditModalOpen,
    setAdjustModalOpen,
    setHistoryModalOpen,
    deleteInventoryItemAPI,
  } = useInventoryStore();

  const { deleteInventoryItemMutation } = useInventoryMutations();

  // Delete Item confirmation
  const handleDelete = async (item: InventoryItemType) => {
    let confirmTitle = "ยืนยันการลบ?";
    let confirmText = `คุณต้องการลบ "${item.name}" ออกจากคลังใช่หรือไม่?`;
    let btnText = "ลบรายการ";
    let cancelText = "ยกเลิก";

    if (isLao) {
      confirmTitle = "ຢືນຢັນການລົບ?";
      confirmText = `ທ່ານຕ້ອງການລົບ "${item.name}" ອອກຈາກສາງແທ້ຫຼືບໍ່?`;
      btnText = "ລົບ";
      cancelText = "ຍົກເລີກ";
    }

    const result = await Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: btnText,
      cancelButtonText: cancelText,
    });

    if (result.isConfirmed) {
      await deleteInventoryItemAPI({
        mutation: deleteInventoryItemMutation,
        _id: item._id,
      });
    }
  };

  if (loading && inventoryList.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400">
        <i className="tabler-loader animate-spin text-4xl mb-3 text-blue-500" />
        <p className="text-xs font-semibold">
          {isLao ? "ກຳລັງໂຫຼດຂໍ້ມູນສາງ..." : "กำลังโหลดข้อมูลคลังสินค้า..."}
        </p>
      </div>
    );
  }

  if (inventoryList.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center text-3xl mb-3 text-gray-400">
          <i className="tabler-box-off" />
        </div>
        <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-1">
          {isLao ? "ບໍ່ພົບຂໍ້ມູນວັດຖຸດິບໃນສາງ" : "ไม่พบรายการสินค้า/วัตถุดิบในคลัง"}
        </h4>
        <p className="text-xs text-gray-400 max-w-sm mb-4">
          {isLao
            ? "ກົດປຸ່ມ 'ເພີ່ມວັດຖຸດິບໃໝ່' ເພື່ອເລີ່ມຕົ້ນບັນທຶກສະຕັອກສິນຄ້າ ຫຼື ປ່ຽນຄຳຄົ້ນຫາ"
            : "กดปุ่ม 'เพิ่มวัตถุดิบใหม่' เพื่อเริ่มบันทึกสต็อก หรือลองเปลี่ยนคำค้นหา"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">{isLao ? "ລາຍການວັດຖຸດິບ" : "รายการสินค้า/วัตถุดิบ"}</th>
              <th className="py-3 px-3">SKU</th>
              <th className="py-3 px-3">{isLao ? "ໝວດໝູ່" : "หมวดหมู่"}</th>
              <th className="py-3 px-4">{isLao ? "ຍອດຄົງເຫຼືອ" : "จำนวนคงเหลือ"}</th>
              <th className="py-3 px-3">{isLao ? "ໜ່ວຍນັບ" : "หน่วยนับ"}</th>
              <th className="py-3 px-4 text-right">{isLao ? "ຕົ້ນທຶນ/ໜ່ວຍ" : "ต้นทุน/หน่วย"}</th>
              <th className="py-3 px-4 text-right">{isLao ? "ມູນຄ່າລວມ" : "มูลค่ารวม"}</th>
              <th className="py-3 px-4 text-center">{isLao ? "ຈັດການ" : "การจัดการ"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
            {inventoryList.map((item) => {
              const currentStock = Number(item.currentStock) || 0;
              const minAlert = Number(item.minStockAlert) || 0;
              const cost = Number(item.costPerUnit) || 0;
              const totalValue = currentStock * cost;

              // Calculate stock status badge without nested ternary
              let stockBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
              let stockStatusText = isLao ? "ພຽງພໍ (In Stock)" : "ปกติ";

              if (currentStock <= 0) {
                stockBadgeClass = "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
                stockStatusText = isLao ? "ໝົດແລ້ວ (Out of Stock)" : "สินค้าหมด";
              } else if (currentStock <= minAlert) {
                stockBadgeClass = "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
                stockStatusText = isLao ? "ໃກ້ໝົດ (Low Stock)" : "ใกล้หมด";
              }

              return (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors"
                >
                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {item.name}
                    </div>
                    {item.minStockAlert > 0 && (
                      <span className="text-[10px] text-gray-400">
                        Min: {item.minStockAlert} {item.unit}
                      </span>
                    )}
                  </td>

                  {/* SKU */}
                  <td className="py-3.5 px-3 font-mono text-gray-500 text-[11px]">
                    {item.sku || "-"}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[11px] font-medium capitalize">
                      {item.category || "General"}
                    </span>
                  </td>

                  {/* Stock Level & Status Badge */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                        {currentStock.toLocaleString()}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${stockBadgeClass}`}
                      >
                        {stockStatusText}
                      </span>
                    </div>
                  </td>

                  {/* Unit */}
                  <td className="py-3.5 px-3 text-gray-600 dark:text-gray-400 font-semibold">
                    {item.unit}
                  </td>

                  {/* Cost per unit */}
                  <td className="py-3.5 px-4 text-right font-mono text-gray-600 dark:text-gray-300">
                    {cost.toLocaleString()} ₭
                  </td>

                  {/* Total stock value */}
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900 dark:text-white font-mono">
                    {totalValue.toLocaleString()} ₭
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      {/* Quick Stock Adjustment */}
                      <button
                        type="button"
                        onClick={() => setAdjustModalOpen(true, item)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-all"
                        title={isLao ? "ປັບຍອດສະຕັອກ (Adjust Stock)" : "ปรับยอดสต็อก"}
                      >
                        <i className="tabler-arrows-up-down text-sm" />
                      </button>

                      {/* View History */}
                      <button
                        type="button"
                        onClick={() => setHistoryModalOpen(true, item)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all"
                        title={isLao ? "ເບິ່ງປະຫວັດເຂົ້າ-ອອກ (History)" : "ดูประวัติเคลื่อนไหว"}
                      >
                        <i className="tabler-history text-sm" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => setEditModalOpen(true, item)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all"
                        title={isLao ? "ແກ້ໄຂ (Edit)" : "แก้ไข"}
                      >
                        <i className="tabler-edit text-sm" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition-all"
                        title={isLao ? "ລົບ (Delete)" : "ลบ"}
                      >
                        <i className="tabler-trash text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
