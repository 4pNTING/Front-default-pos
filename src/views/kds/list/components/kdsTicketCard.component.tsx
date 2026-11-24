"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import CustomChip from "@core/components/mui/Chip";
import CustomAvatar from "@core/components/mui/Avatar";

import { useKdsStore } from "../../store/kdsStore";
import { usePrinterStore } from "@/views/pos/store/printerStore";
import { OrderType, POSTableType, IPosOrderStatus } from "@/views/pos/type/posType";
import { KdsElapsedInfo } from "../../type/kdsType";
import { ToastService } from "@/utils/toastService";

interface KdsTicketCardProps {
  order: OrderType;
  table?: POSTableType;
  currentTime: number;
  lang: string;
  onUpdateStatus: (order: OrderType, newStatus: string) => Promise<void>;
}

export const KdsTicketCardComponent: React.FC<KdsTicketCardProps> = ({
  order,
  table,
  currentTime,
  lang,
  onUpdateStatus,
}) => {
  const { checkedItems, toggleItemCheck } = useKdsStore();
  const { printKitchenTicketDirect } = usePrinterStore();

  const getElapsedTime = (): KdsElapsedInfo => {
    if (!order.createdAt) {
      return { text: "00:00", minutes: 0, level: "fresh" };
    }
    const createdTime = new Date(order.createdAt).getTime();
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

  const elapsed = getElapsedTime();

  const handlePrintTicket = async () => {
    let formattedDate = "";
    if (order.createdAt) {
      formattedDate = new Date(order.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      formattedDate = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const items = order.items || [];
    const res = await printKitchenTicketDirect({
      orderNumber: order.orderNumber,
      tableNumber: table?.number || "-",
      zoneName: table?.zoneName,
      date: formattedDate,
      note: order.note,
      items: items.map((i) => ({
        name: i.menuItemName,
        quantity: i.quantity,
        note: i.note,
      })),
    });

    if (res.success) {
      ToastService.success(lang === "la" ? "ພິມໃບສັ່ງຄົວສຳເລັດ!" : "พิมพ์ใบสั่งครัวสำเร็จ!");
    } else {
      ToastService.error(res.error || (lang === "la" ? "ການພິມລົ້ມເຫຼວ" : "การพิมพ์ล้มเหลว"));
    }
  };

  const getTimerChipColor = (): "success" | "warning" | "error" => {
    if (elapsed.level === "urgent") {
      return "error";
    }
    if (elapsed.level === "warning") {
      return "warning";
    }
    return "success";
  };

  const getTimerIcon = (): string => {
    if (elapsed.level === "urgent") {
      return "tabler-alert-triangle text-xs animate-bounce";
    }
    return "tabler-clock text-xs";
  };

  const getCardBorderColor = (): string => {
    if (elapsed.level === "urgent") {
      return "var(--mui-palette-error-main)";
    }
    if (order.status === IPosOrderStatus.preparing || order.status === "cooking") {
      return "var(--mui-palette-warning-main)";
    }
    if (order.status === IPosOrderStatus.served) {
      return "var(--mui-palette-success-main)";
    }
    return "var(--mui-palette-info-main)";
  };

  const getStatusChipColor = (): "info" | "warning" | "success" | "secondary" | "error" => {
    if (order.status === IPosOrderStatus.paid || order.status === IPosOrderStatus.completed) {
      return "success";
    }
    if (order.status === IPosOrderStatus.served) {
      return "success";
    }
    if (order.status === IPosOrderStatus.preparing || order.status === "cooking") {
      return "warning";
    }
    if (order.status === IPosOrderStatus.pending || order.status === IPosOrderStatus.confirmed) {
      return "info";
    }
    if (order.status === IPosOrderStatus.cancelled) {
      return "error";
    }
    return "secondary";
  };

  const getStatusLabel = (): string => {
    if (order.status === IPosOrderStatus.paid || order.status === IPosOrderStatus.completed) {
      if (lang === "la") {
        return "ຊຳລະເງິນແລ້ວ";
      }
      return "ชำระเงินแล้ว";
    }
    if (order.status === IPosOrderStatus.served) {
      if (lang === "la") {
        return "ເສີບແລ້ວ";
      }
      return "เสิร์ฟแล้ว";
    }
    if (order.status === IPosOrderStatus.preparing || order.status === "cooking") {
      if (lang === "la") {
        return "ກຳລັງປຸງ";
      }
      return "กำลังปรุง";
    }
    if (order.status === IPosOrderStatus.pending || order.status === IPosOrderStatus.confirmed) {
      if (lang === "la") {
        return "ອໍເດີໃໝ່";
      }
      return "ออเดอร์ใหม่";
    }
    if (order.status === IPosOrderStatus.cancelled) {
      if (lang === "la") {
        return "ຍົກເລີກ";
      }
      return "ยกเลิก";
    }
    return order.status;
  };

  const items = order.items || [];
  const tableNumberText = table?.number ? `${table.number}` : "-";
  const tableTitle = lang === "la" ? `ໂຕະ ${tableNumberText}` : `โต๊ะ ${tableNumberText}`;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: "4px solid",
        borderTopColor: getCardBorderColor(),
        boxShadow: elapsed.level === "urgent" ? "0 4px 18px rgba(239, 68, 68, 0.25)" : 1,
        transition: "all 0.3s ease",
      }}
    >
      {/* Ticket Header */}
      <div className="p-3.5 border-b border-divider flex items-center justify-between gap-2 bg-actionHover">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Typography variant="h6" className="font-bold">
              {tableTitle}
            </Typography>
            {table?.zoneName && (
              <CustomChip
                size="small"
                variant="tonal"
                color="secondary"
                label={table.zoneName}
              />
            )}
          </div>
          <Typography variant="caption" color="text.secondary" className="font-mono">
            #{order.orderNumber}
          </Typography>
        </div>

        <div className="flex items-center gap-1.5">
          <Tooltip title={lang === "la" ? "ພິມໃບສັ່ງຄົວ" : "พิมพ์ใบสั่งครัว"}>
            <IconButton
              size="small"
              onClick={handlePrintTicket}
              color="secondary"
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <i className="tabler-printer text-sm" />
            </IconButton>
          </Tooltip>

          <CustomChip
            round="true"
            size="small"
            variant="tonal"
            color={getTimerChipColor()}
            icon={<i className={getTimerIcon()} />}
            label={elapsed.text}
          />
        </div>
      </div>

      {/* Special Allergy / Chef Note Warning Banner */}
      {order.note && (
        <div className="px-3.5 py-2 bg-warning-lightOpacity border-b border-warning-main/30 flex items-start gap-1.5 text-xs text-warning-main font-semibold">
          <i className="tabler-alert-triangle text-base shrink-0 mt-0.5" />
          <span className="line-clamp-2">{order.note}</span>
        </div>
      )}

      {/* Ticket Items List */}
      <CardContent className="flex-1 p-3.5 space-y-2 overflow-y-auto max-h-[320px]">
        {items.map((item, idx) => {
          const itemKey = `${order._id}_${item._id || idx}`;
          const isChecked = !!checkedItems[itemKey];

          return (
            <div
              key={itemKey}
              onClick={() => toggleItemCheck(order._id, item._id || String(idx))}
              className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 cursor-pointer transition-all ${
                isChecked
                  ? "bg-actionHover border-divider opacity-45 line-through"
                  : "border-divider hover:border-primary-main bg-backgroundPaper"
              }`}
            >
              <div className="flex items-start gap-2 flex-1">
                <Checkbox
                  size="small"
                  checked={isChecked}
                  sx={{ p: 0, mt: 0.2 }}
                />
                <div>
                  <Typography
                    variant="body2"
                    className={`font-semibold ${isChecked ? "line-through text-textSecondary" : "text-textPrimary"}`}
                  >
                    {item.menuItemName}
                  </Typography>
                  {item.note && (
                    <Typography
                      variant="caption"
                      color="warning.main"
                      className="font-medium block mt-0.5"
                    >
                      ↳ {item.note}
                    </Typography>
                  )}
                </div>
              </div>

              <CustomChip
                round="true"
                size="small"
                variant="tonal"
                color={isChecked ? "secondary" : "warning"}
                label={`x${item.quantity}`}
              />
            </div>
          );
        })}
      </CardContent>

      {/* Ticket Footer Action Buttons */}
      <div className="p-3 border-t border-divider bg-actionHover flex items-center gap-2">
        {(order.status === IPosOrderStatus.pending ||
          order.status === IPosOrderStatus.confirmed) && (
          <Button
            fullWidth
            variant="contained"
            color="warning"
            size="small"
            onClick={() => onUpdateStatus(order, IPosOrderStatus.preparing)}
            startIcon={<i className="tabler-flame" />}
          >
            {lang === "la" ? "ເລີ່ມປຸງແຕ່ງ (Cooking)" : "เริ่มปรุงอาหาร (Cooking)"}
          </Button>
        )}

        {(order.status === IPosOrderStatus.preparing || order.status === "cooking") && (
          <Button
            fullWidth
            variant="contained"
            color="success"
            size="small"
            onClick={() => onUpdateStatus(order, IPosOrderStatus.served)}
            startIcon={<i className="tabler-check" />}
          >
            {lang === "la" ? "ເສີບອາຫານແລ້ວ (Ready & Served)" : "เสิร์ฟแล้ว (Ready & Served)"}
          </Button>
        )}

        {order.status === IPosOrderStatus.served && (
          <div className="w-full flex justify-center py-1">
            <CustomChip
              round="true"
              size="small"
              variant="tonal"
              color={getStatusChipColor()}
              icon={<i className="tabler-check text-xs" />}
              label={getStatusLabel()}
            />
          </div>
        )}

        {(order.status === IPosOrderStatus.paid || order.status === IPosOrderStatus.completed) && (
          <div className="w-full flex justify-center py-1">
            <CustomChip
              round="true"
              size="small"
              variant="tonal"
              color="success"
              icon={<i className="tabler-circle-check text-xs" />}
              label={getStatusLabel()}
            />
          </div>
        )}

        {order.status === IPosOrderStatus.cancelled && (
          <div className="w-full flex justify-center py-1">
            <CustomChip
              round="true"
              size="small"
              variant="tonal"
              color="error"
              icon={<i className="tabler-x text-xs" />}
              label={getStatusLabel()}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
