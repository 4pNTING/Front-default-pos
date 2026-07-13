import React from "react";

// Status color mapping - รองรับทั้ง Leasing, Floor, Room, Payment และอื่นๆ
export const STATUS_COLORS = {
  // Room/Leasing Status (Lao)
  ກຳລັງເຊົ່າ:
    "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
  ວ່າງ: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300",
  ສັນຍາໝົດອາຍຸ:
    "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",

  // RoomAreaStatus codes (IRoomAreaStatus)
  using:
    "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
  empty:
    "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300",

  // Electric/Water Status
  recorded:
    "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
  billed:
    "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300",
  completed:
    "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",

  // Leasing Batch Electric/Water Status (ILeasingBatchElectricStatus)
  pending_submit:
    "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
  pending_approve:
    "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",
  approved:
    "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",

  // Leasing EW Invoice Status (ILeasingEWInvoiceStatus)
  approved_and_no_invoice:
    "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300",
  approved_and_invoice:
    "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
  pending:
    "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",

  // Sales Report Status
  renew:
    "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
  new: "bg-gradient-to-r from-orange-100 to-yellow-200 text-yellow-800 border-yellow-300",

  // General Status (English)
  pending_active:
    "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",
  active:
    "bg-gradient-to-r from-green-100 to-green-200 text-gray-800 border-green-300",
  Active:
    "bg-gradient-to-r from-green-100 to-green-200 text-gray-800 border-green-300",
  inactive:
    "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
  Inactive:
    "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",

  // Contract Status (pending ถูกรวมกับ Leasing EW Invoice Status แล้ว)
  expired:
    "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
  terminated:
    "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300",

  // Payment Status
  paid: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
  unpaid:
    "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
  overdue:
    "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",

  // Hold Status (rent/buyer)
  rent: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300",
  buyer:
    "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",

  // Agent Hold Status (owner/agent/bu)
  owner:
    "bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300",
  agent:
    "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300",
  bu: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",

  // Default
  default:
    "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200",
} as const;

// Hold Status (rent/buyer) - MUI Chip colors
export const HOLD_STATUS_COLORS = {
  rent: "info",
  buyer: "success",
  default: "default",
} as const;

// Agent Hold Status (owner/agent/bu) - MUI Chip colors
export const AGENT_HOLD_STATUS_COLORS = {
  owner: "success",
  agent: "warning",
  bu: "info",
  default: "default",
} as const;

// Room/Leasing Status labels
export const ROOM_STATUS_LABELS = {
  using: "ກຳລັງເຊົ່າ",
  empty: "ວ່າງ",
  expired: "ໝົດອາຍຸ",
} as const;

// General Status labels
export const GENERAL_STATUS_LABELS = {
  pending_active: "ລໍຖ້າເປີດໃຊ້ງານ",
  active: "ເປີດໃຊ້ງານ",
  Active: "ເປີດໃຊ້ງານ",
  inactive: "ປິດໃຊ້ງານ",
  Inactive: "ປິດໃຊ້ງານ",
} as const;

// Contract Status labels
export const CONTRACT_STATUS_LABELS = {
  pending: "ລໍຖ້າອະນຸມັດ",
  expired: "ໝົດອາຍຸ",
  terminated: "ຍົກເລີກແລ້ວ",
} as const;

// Payment Status labels
export const PAYMENT_STATUS_LABELS = {
  paid: "ຈ່າຍແລ້ວ",
  unpaid: "ຍັງບໍ່ໄດ້ຈ່າຍ",
  overdue: "ເກີນກຳນົດ",
} as const;

// Hold Status labels
export const HOLD_STATUS_LABELS = {
  rent: "ຫ້ອງເຊົ່າ",
  buyer: "ຫ້ອງຊື້",
} as const;

// Agent Hold Status labels
export const AGENT_HOLD_STATUS_LABELS = {
  owner: "ເຈົ້າຂອງຢູ່ເອງ",
  agent: "ໂອນສິດບໍລິຫານ",
  bu: "BU",
} as const;

// Electric/Water Status labels
export const ELECTRIC_WATER_STATUS_LABELS = {
  recorded: "ບັນທຶກແລ້ວ",
  billed: "ອອກບິນແລ້ວ",
  completed: "ເສັດສິ້ນ",
  using: "ກຳລັງໃຊ້ງານ",
} as const;

// Leasing Batch Electric/Water Status labels (ILeasingBatchElectricStatus)
export const LEASING_BATCH_STATUS_LABELS = {
  pending_submit: "ລໍຖ້າສົ່ງກວດ",
  pending_approve: "ລໍຖ້າອະນຸມັດ",
  approved: "ອະນຸມັດແລ້ວ",
} as const;

// Leasing EW Invoice Status labels (ILeasingEWInvoiceStatus)
export const LEASING_EW_INVOICE_STATUS_LABELS = {
  approved_and_no_invoice: "ອະນຸມັດແລ້ວ (ບໍ່ມີ Invoice)",
  approved_and_invoice: "ສ້າງ (Invoice ແລ້ວ)",
  pending: "ລໍຖ້າອະນຸມັດ",
} as const;

// Sales Report Status labels (ISalesReportType)
export const SALES_REPORT_STATUS_LABELS = {
  renew: "ຕໍ່ສັນຍາ",
  new: "ສັນຍາໃໝ່",
} as const;

// Leasing Batch Electric/Water Status colors
export const LEASING_BATCH_STATUS_COLORS = {
  pending_submit: "warning",
  pending_approve: "info",
  approved: "success",
  default: "default",
} as const;

// Electric/Water Status colors
export const ELECTRIC_WATER_STATUS_COLORS = {
  recorded: "info",
  billed: "warning",
  completed: "success",
  using: "success",
  default: "default",
} as const;

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  dictionary?: any;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "md",
  dictionary,
}) => {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs min-w-[80px]",
    md: "px-4 py-1.5 text-xs min-w-[100px]",
    lg: "px-5 py-2 text-sm min-w-[120px]",
  };

  const colorClass =
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.default;

  // แปลง status code เป็น label
  let displayText = status || "Unknown";

  // Priority: dictionary > specific labels > status
  if (dictionary && dictionary[status]) {
    displayText = dictionary[status];
  }
  // Room/Leasing Status
  else if (status in ROOM_STATUS_LABELS) {
    displayText = ROOM_STATUS_LABELS[status as keyof typeof ROOM_STATUS_LABELS];
  }
  // General Status
  else if (status in GENERAL_STATUS_LABELS) {
    displayText =
      GENERAL_STATUS_LABELS[status as keyof typeof GENERAL_STATUS_LABELS];
  }
  // Contract Status
  else if (status in CONTRACT_STATUS_LABELS) {
    displayText =
      CONTRACT_STATUS_LABELS[status as keyof typeof CONTRACT_STATUS_LABELS];
  }
  // Payment Status
  else if (status in PAYMENT_STATUS_LABELS) {
    displayText =
      PAYMENT_STATUS_LABELS[status as keyof typeof PAYMENT_STATUS_LABELS];
  }
  // Hold Status
  else if (status in HOLD_STATUS_LABELS) {
    displayText = HOLD_STATUS_LABELS[status as keyof typeof HOLD_STATUS_LABELS];
  }
  // Agent Hold Status
  else if (status in AGENT_HOLD_STATUS_LABELS) {
    displayText =
      AGENT_HOLD_STATUS_LABELS[status as keyof typeof AGENT_HOLD_STATUS_LABELS];
  }
  // Electric/Water Status
  else if (status in ELECTRIC_WATER_STATUS_LABELS) {
    displayText =
      ELECTRIC_WATER_STATUS_LABELS[
        status as keyof typeof ELECTRIC_WATER_STATUS_LABELS
      ];
  }
  // Leasing Batch Status (pending_submit, pending_approve, approved)
  else if (status in LEASING_BATCH_STATUS_LABELS) {
    displayText =
      LEASING_BATCH_STATUS_LABELS[
        status as keyof typeof LEASING_BATCH_STATUS_LABELS
      ];
  }
  // Leasing EW Invoice Status (approved_and_no_invoice, approved_and_invoice, pending)
  else if (status in LEASING_EW_INVOICE_STATUS_LABELS) {
    displayText =
      LEASING_EW_INVOICE_STATUS_LABELS[
        status as keyof typeof LEASING_EW_INVOICE_STATUS_LABELS
      ];
  }
  // Sales Report Status (new, renew)
  else if (status in SALES_REPORT_STATUS_LABELS) {
    displayText =
      SALES_REPORT_STATUS_LABELS[
        status as keyof typeof SALES_REPORT_STATUS_LABELS
      ];
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold border ${colorClass} ${sizeClasses[size]} ${className}`}
    >
      {displayText}
    </span>
  );
};

// Hook for getting status color class
export const useStatusColor = (status: string): string => {
  return (
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default
  );
};

// Utility function for getting status color class
export const getStatusColorClass = (status: string): string => {
  return (
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default
  );
};

// Interface for ProcessInfo
interface ProcessInfo {
  color: any;
  label: string;
}

/**
 * Get hold status info (rent/buyer)
 */
export function getHoldStatusInfo(value?: string): ProcessInfo | undefined {
  if (!value) return undefined;
  const label = HOLD_STATUS_LABELS[value as keyof typeof HOLD_STATUS_LABELS];
  const color =
    HOLD_STATUS_COLORS[value as keyof typeof HOLD_STATUS_COLORS] ||
    HOLD_STATUS_COLORS.default;

  if (!label) return undefined;
  return { color, label };
}

/**
 * Get agent hold status info (owner/agent/bu)
 */
export function getAgentHoldStatusInfo(
  value?: string,
): ProcessInfo | undefined {
  if (!value) return undefined;
  const label =
    AGENT_HOLD_STATUS_LABELS[value as keyof typeof AGENT_HOLD_STATUS_LABELS];
  const color =
    AGENT_HOLD_STATUS_COLORS[value as keyof typeof AGENT_HOLD_STATUS_COLORS] ||
    AGENT_HOLD_STATUS_COLORS.default;

  if (!label) return undefined;
  return { color, label };
}

/**
 * Get electric/water status info (recorded/billed/completed/using)
 */
export function getElectricWaterStatusInfo(
  value?: string,
): ProcessInfo | undefined {
  if (!value) return undefined;
  const label =
    ELECTRIC_WATER_STATUS_LABELS[
      value as keyof typeof ELECTRIC_WATER_STATUS_LABELS
    ];
  const color =
    ELECTRIC_WATER_STATUS_COLORS[
      value as keyof typeof ELECTRIC_WATER_STATUS_COLORS
    ] || ELECTRIC_WATER_STATUS_COLORS.default;

  if (!label) return undefined;
  return { color, label };
}

/**
 * Get room status label (using/empty/expired)
 */
export function getRoomStatusLabel(value?: string): string | undefined {
  if (!value) return undefined;
  return ROOM_STATUS_LABELS[value as keyof typeof ROOM_STATUS_LABELS];
}

/**
 * Get general status label (active/inactive)
 */
export function getGeneralStatusLabel(value?: string): string | undefined {
  if (!value) return undefined;
  return GENERAL_STATUS_LABELS[value as keyof typeof GENERAL_STATUS_LABELS];
}

/**
 * Get contract status label (pending/expired/terminated)
 */
export function getContractStatusLabel(value?: string): string | undefined {
  if (!value) return undefined;
  return CONTRACT_STATUS_LABELS[value as keyof typeof CONTRACT_STATUS_LABELS];
}

/**
 * Get payment status label (paid/unpaid/overdue)
 */
export function getPaymentStatusLabel(value?: string): string | undefined {
  if (!value) return undefined;
  return PAYMENT_STATUS_LABELS[value as keyof typeof PAYMENT_STATUS_LABELS];
}

export default StatusBadge;
