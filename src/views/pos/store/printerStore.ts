"use client";

import { create } from "zustand";
import {
  PrintableReceiptData,
  PrintableKitchenData,
  ESCPOSOptions,
} from "@/utils/escpos";

export interface CashierPrinterConfig {
  enabled: boolean;
  mode: "network" | "browser"; // network = Direct ESC/POS Port 9100, browser = window.print()
  ip: string;
  port: number;
  paperWidth: "80mm" | "58mm";
  autoOpenDrawer: boolean;
  autoPrintOnPayment: boolean;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  headerText: string;
  footerText: string;
  showQrCode: boolean;
  qrCodeUrl?: string;
}

export interface KitchenPrinterConfig {
  enabled: boolean;
  ip: string;
  port: number;
  paperWidth: "80mm" | "58mm";
  autoPrintOnOrder: boolean;
  beep: boolean;
}

export interface PrinterState {
  cashierPrinter: CashierPrinterConfig;
  kitchenPrinter: KitchenPrinterConfig;
  isSettingsOpen: boolean;
  isPrinting: boolean;
  lastPrintStatus: {
    success: boolean;
    message?: string;
    timestamp?: number;
  } | null;

  // Actions
  setSettingsOpen: (open: boolean) => void;
  updateCashierPrinter: (cfg: Partial<CashierPrinterConfig>) => void;
  updateKitchenPrinter: (cfg: Partial<KitchenPrinterConfig>) => void;
  resetDefaults: () => void;
  testPrinter: (ip: string, port?: number) => Promise<{ success: boolean; latencyMs?: number; error?: string }>;
  printTestSlip: (
    ip: string,
    port?: number,
    paperWidth?: "80mm" | "58mm",
    targetName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  openDrawerDirect: (ip?: string, port?: number) => Promise<{ success: boolean; error?: string }>;
  printReceiptDirect: (data: PrintableReceiptData) => Promise<{ success: boolean; error?: string }>;
  printKitchenTicketDirect: (data: PrintableKitchenData) => Promise<{ success: boolean; error?: string }>;
}

const STORAGE_KEY = "pos_thermal_printer_config_v2";

const defaultCashierPrinter: CashierPrinterConfig = {
  enabled: true,
  mode: "network",
  ip: "192.168.1.200",
  port: 9100,
  paperWidth: "80mm",
  autoOpenDrawer: true,
  autoPrintOnPayment: true,
  shopName: "LAO WORLD RESTAURANT",
  shopAddress: "Khouvieng Road, Vientiane, Lao PDR",
  shopPhone: "+856 20 5555 9999",
  headerText: "ยินดีต้อนรับ / ຍິນດີຕ້ອນຮັບ",
  footerText: "THANK YOU / ຂໍຂອບໃຈທີ່ມາໃຊບໍລິການ",
  showQrCode: true,
  qrCodeUrl: "https://laoworld.la",
};

const defaultKitchenPrinter: KitchenPrinterConfig = {
  enabled: true,
  ip: "192.168.1.201",
  port: 9100,
  paperWidth: "80mm",
  autoPrintOnOrder: true,
  beep: true,
};

function getInitialConfig(): {
  cashier: CashierPrinterConfig;
  kitchen: KitchenPrinterConfig;
} {
  if (typeof window === "undefined") {
    return { cashier: defaultCashierPrinter, kitchen: defaultKitchenPrinter };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cashier: { ...defaultCashierPrinter, ...parsed.cashier },
        kitchen: { ...defaultKitchenPrinter, ...parsed.kitchen },
      };
    }
  } catch (err) {
    console.warn("Failed to load printer settings from localStorage:", err);
  }

  return { cashier: defaultCashierPrinter, kitchen: defaultKitchenPrinter };
}

function saveConfig(cashier: CashierPrinterConfig, kitchen: KitchenPrinterConfig) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cashier, kitchen }));
  } catch (err) {
    console.warn("Failed to persist printer settings:", err);
  }
}

export const usePrinterStore = create<PrinterState>((set, get) => {
  const initial = getInitialConfig();

  return {
    cashierPrinter: initial.cashier,
    kitchenPrinter: initial.kitchen,
    isSettingsOpen: false,
    isPrinting: false,
    lastPrintStatus: null,

    setSettingsOpen: (open: boolean) => set({ isSettingsOpen: open }),

    updateCashierPrinter: (cfg: Partial<CashierPrinterConfig>) => {
      set((state) => {
        const updated = { ...state.cashierPrinter, ...cfg };
        saveConfig(updated, state.kitchenPrinter);
        return { cashierPrinter: updated };
      });
    },

    updateKitchenPrinter: (cfg: Partial<KitchenPrinterConfig>) => {
      set((state) => {
        const updated = { ...state.kitchenPrinter, ...cfg };
        saveConfig(state.cashierPrinter, updated);
        return { kitchenPrinter: updated };
      });
    },

    resetDefaults: () => {
      saveConfig(defaultCashierPrinter, defaultKitchenPrinter);
      set({
        cashierPrinter: defaultCashierPrinter,
        kitchenPrinter: defaultKitchenPrinter,
        lastPrintStatus: null,
      });
    },

    // 1. Ping / Test connection over TCP socket
    testPrinter: async (ip: string, port: number = 9100) => {
      try {
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ping", ip, port }),
        });
        const json = await res.json();
        return json;
      } catch (err: any) {
        return {
          success: false,
          error: err.message || "Failed to reach server print route",
        };
      }
    },

    // 2. Print diagnostic test slip
    printTestSlip: async (
      ip: string,
      port: number = 9100,
      paperWidth: "80mm" | "58mm" = "80mm",
      targetName: string = "Diagnostic Slip"
    ) => {
      set({ isPrinting: true });
      try {
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "print-test",
            ip,
            port,
            options: { paperWidth, targetName, beep: true },
          }),
        });
        const json = await res.json();
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: json.success,
            message: json.success ? "Test slip printed successfully" : json.error,
            timestamp: Date.now(),
          },
        });
        return json;
      } catch (err: any) {
        set({ isPrinting: false });
        return { success: false, error: err.message };
      }
    },

    // 3. Open cash drawer pulse
    openDrawerDirect: async (ip?: string, port?: number) => {
      const targetIp = ip || get().cashierPrinter.ip;
      const targetPort = port || get().cashierPrinter.port;

      try {
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "open-drawer",
            ip: targetIp,
            port: targetPort,
          }),
        });
        const json = await res.json();
        return json;
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    // 4. Print customer receipt / bill
    printReceiptDirect: async (data: PrintableReceiptData) => {
      const { cashierPrinter } = get();

      // Merge store header and footer configuration into receipt data
      const enrichedData: PrintableReceiptData = {
        ...data,
        shopName: cashierPrinter.shopName || data.shopName,
        shopAddress: cashierPrinter.shopAddress || data.shopAddress,
        shopPhone: cashierPrinter.shopPhone || data.shopPhone,
        headerText: cashierPrinter.headerText || data.headerText,
        footerText: cashierPrinter.footerText || data.footerText,
        qrCodeUrl: cashierPrinter.showQrCode ? cashierPrinter.qrCodeUrl : undefined,
      };

      set({ isPrinting: true });
      try {
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "print-receipt",
            ip: cashierPrinter.ip,
            port: cashierPrinter.port,
            data: enrichedData,
            options: {
              paperWidth: cashierPrinter.paperWidth,
              openDrawer: cashierPrinter.autoOpenDrawer && data.type === "receipt",
              cutPaper: true,
            },
          }),
        });
        const json = await res.json();
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: json.success,
            message: json.success ? "Receipt printed successfully" : json.error,
            timestamp: Date.now(),
          },
        });
        return json;
      } catch (err: any) {
        set({ isPrinting: false });
        return { success: false, error: err.message };
      }
    },

    // 5. Print kitchen order ticket
    printKitchenTicketDirect: async (data: PrintableKitchenData) => {
      const { kitchenPrinter } = get();
      if (!kitchenPrinter.enabled) {
        return { success: false, error: "Kitchen printer is currently disabled." };
      }

      set({ isPrinting: true });
      try {
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "print-kitchen",
            ip: kitchenPrinter.ip,
            port: kitchenPrinter.port,
            data,
            options: {
              paperWidth: kitchenPrinter.paperWidth,
              beep: kitchenPrinter.beep,
              cutPaper: true,
            },
          }),
        });
        const json = await res.json();
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: json.success,
            message: json.success ? "Kitchen ticket printed successfully" : json.error,
            timestamp: Date.now(),
          },
        });
        return json;
      } catch (err: any) {
        set({ isPrinting: false });
        return { success: false, error: err.message };
      }
    },
  };
});
