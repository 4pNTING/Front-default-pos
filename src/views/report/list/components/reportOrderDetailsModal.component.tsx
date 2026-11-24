"use client";

import React from "react";
import { OrderType } from "@/views/pos/type/posType";
import { Dialog, DialogTitle, DialogContent, IconButton, Button, Chip } from "@mui/material";

interface ReportOrderDetailsModalProps {
  order: OrderType | null;
  onClose: () => void;
  onPrint: (order: OrderType) => void;
  lang: string;
  getTableInfo: (tableId?: string) => { number: string; zoneName: string };
}

export const ReportOrderDetailsModal: React.FC<ReportOrderDetailsModalProps> = ({
  order,
  onClose,
  onPrint,
  lang,
  getTableInfo,
}) => {
  if (!order) return null;

  const isLao = lang.startsWith("la");
  const tableInfo = getTableInfo(order.tableId);
  const items = order.items || [];

  const getStatusColor = (status: string): "success" | "error" | "secondary" => {
    if (status === "paid") return "success";
    if (status === "cancelled") return "error";
    return "secondary";
  };

  const getStatusLabel = (status: string): string => {
    if (status === "paid") {
      return isLao ? "ຊຳລະແລ້ວ" : "PAID";
    }
    if (status === "cancelled") {
      return isLao ? "ຍົກເລີກ" : "CANCELLED";
    }
    return status.toUpperCase();
  };

  return (
    <Dialog
      open={Boolean(order)}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0A3981",
          color: "white",
        }}
      >
        <div className="flex items-center gap-2">
          <i className="tabler-receipt text-xl" />
          <div>
            <h4 className="font-bold text-sm leading-tight">{order.orderNumber}</h4>
            <p className="text-xs text-blue-200 mt-0.5">
              {isLao ? "ໂຕະ" : "Table"} {tableInfo.number} {tableInfo.zoneName ? `(${tableInfo.zoneName})` : ""}
            </p>
          </div>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" } }}
        >
          <i className="tabler-x text-lg" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <div className="space-y-3">
          {/* Order Meta info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">{isLao ? "ວັນທີ & ເວລາ" : "Date & Time"}:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{isLao ? "ສະຖານະ" : "Status"}:</span>
              <Chip
                label={getStatusLabel(order.status)}
                color={getStatusColor(order.status)}
                size="small"
                variant="tonal"
                sx={{ height: 20, fontSize: "10px", fontWeight: 700 }}
              />
            </div>
            {order.note && (
              <div className="flex justify-between">
                <span className="text-gray-400">{isLao ? "ໝາຍເຫດ" : "Note"}:</span>
                <span className="text-gray-700 dark:text-gray-300 italic">{order.note}</span>
              </div>
            )}
          </div>

          {/* Items Breakdown */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              {isLao ? "ລາຍການອາຫານ" : "Ordered Items"} ({items.length})
            </h5>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60 max-h-52 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-start justify-between text-xs">
                  <div className="pr-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {item.menuItemName}
                    </div>
                    {item.note && (
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 italic">
                        * {item.note}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400">
                      {Number(item.unitPrice).toLocaleString()} ₭ × {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white shrink-0">
                    {Number(item.totalPrice).toLocaleString()} ₭
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-2.5 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-500">
              <span>{isLao ? "ຍອດລວມກ່ອນຫຼຸດ" : "Subtotal"}:</span>
              <span>{Number(order.subTotal || 0).toLocaleString()} ₭</span>
            </div>
            {Number(order.discount || 0) > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>{isLao ? "ສ່ວນຫຼຸດ" : "Discount"}:</span>
                <span>-{Number(order.discount).toLocaleString()} ₭</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-700">
              <span>{isLao ? "ຍອດຊຳລະສຸດທິ" : "Grand Total"}:</span>
              <span className="text-[#2F57AB] dark:text-blue-400 font-extrabold text-base">
                {Number(order.total || 0).toLocaleString()} ₭
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              onPrint(order);
              onClose();
            }}
            sx={{
              backgroundColor: "#0A3981",
              mt: 1,
              py: 1.2,
              fontWeight: 700,
              "&:hover": { backgroundColor: "#082d5c" },
            }}
            startIcon={<i className="tabler-printer text-base" />}
          >
            {isLao ? "ພິມໃບບິນໃໝ່ (Re-print)" : "Re-print Receipt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportOrderDetailsModal;
