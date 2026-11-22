"use client";

import React from "react";
import { useInventoryStore } from "../../store/inventoryStore";
import { InventoryListProps } from "../../type/inventoryType";

export const LowStockBannerComponent: React.FC<{ props: InventoryListProps }> = ({ props }) => {
  const { lang } = props;
  const isLao = lang === "la";

  const { lowStockItems, setAdjustModalOpen } = useInventoryStore();

  if (!lowStockItems || lowStockItems.length === 0) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
          <i className="tabler-alert-triangle animate-bounce" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
            {isLao
              ? `ແຈ້ງເຕືອນ: ມີ ${lowStockItems.length} ລາຍການ ທີ່ສະຕັອກໃກ້ໝົດ ຫຼື ໝົດແລ້ວ!`
              : `แจ้งเตือน: มี ${lowStockItems.length} รายการ ที่สต็อกใกล้หมดหรือหมดแล้ว!`}
          </h4>
          <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
            {isLao
              ? "ຄວນສັ່ງຊື້ ຫຼື ຮັບສິນຄ້າເຂົ້າສາງ ເພື່ອບໍ່ໃຫ້ກະທົບກັບການຂາຍໃນຮ້ານ"
              : "กรุณาสั่งซื้อหรือปรับยอดรับเข้าคลัง เพื่อป้องกันเมนูอาหารใน POS ขาดตอน"}
          </p>
        </div>
      </div>

      {/* Quick items list */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {lowStockItems.slice(0, 3).map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={() => setAdjustModalOpen(true, item)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all flex items-center gap-1.5"
            title="Click to adjust stock"
          >
            <span>{item.name}</span>
            <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">
              ({item.currentStock} {item.unit})
            </span>
            <i className="tabler-plus text-xs" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LowStockBannerComponent;
