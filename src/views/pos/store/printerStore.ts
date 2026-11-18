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
}

export interface KitchenPrinterConfig {
  enabled: boolean;
  ip: string;
  port: number;
  paperWidth: "80mm" | "58mm";
  autoPrintOnOrder: boolean;
  beep: boolean;
}

interface PrinterState {
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
  printTestSlip: (ip: string, port?: number, paperWidth?: "80mm" | "58mm") => Promise<{ success: boolean; error?: string }>;
  openDrawerDirect: (ip?: string, port?: number) => Promise<{ success: boolean; error?: string }>;
  printReceiptDirect: (data: PrintableReceiptData) => Promise<{ success: boolean; error?: string }>;
  printKitchenTicketDirect: (data: PrintableKitchenData) => Promise<{ success: boolean; error?: string }>;
}

const STORAGE_KEY = "pos_printer_configuration_v1";

const defaultCashierPrinter: CashierPrinterConfig = {
  enabled: true,
  mode: "network",
  ip: "192.168.1.200",
  port: 9100,
  paperWidth: "80mm",
  autoOpenDrawer: true,
  autoPrintOnPayment: true,
};

const defaultKitchenPrinter: KitchenPrinterConfig = {
  enabled: false,
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
    console.warn("Failed to save printer settings to localStorage:", err);
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
      });
    },

    // Test connection / ping printer IP
    testPrinter: async (ip: string, port: number = 9100) => {
      try {
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "test", ip, port }),
        });
        const data = await res.json();
        return data;
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to reach print server" };
      }
    },

    // Print sample test receipt
    printTestSlip: async (ip: string, port: number = 9100, paperWidth: "80mm" | "58mm" = "80mm") => {
      try {
        set({ isPrinting: true });
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "print-test",
            ip,
            port,
            options: { paperWidth, cutPaper: true },
          }),
        });
        const data = await res.json();
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: data.success,
            message: data.success ? "Test slip printed successfully" : data.error,
            timestamp: Date.now(),
          },
        });
        return data;
      } catch (err: any) {
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: false,
            message: err.message || "Network error while printing",
            timestamp: Date.now(),
          },
        });
        return { success: false, error: err.message || "Network error" };
      }
    },

    // Trigger RJ11 cash drawer kick
    openDrawerDirect: async (ip?: string, port?: number) => {
      const state = get();
      const targetIp = ip || state.cashierPrinter.ip;
      const targetPort = port || state.cashierPrinter.port;

      if (!targetIp) {
        return { success: false, error: "Cashier printer IP is not configured" };
      }

      try {
        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "open-drawer", ip: targetIp, port: targetPort }),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to trigger drawer kick" };
      }
    },

    // Print Receipt or Bill directly
    printReceiptDirect: async (data: PrintableReceiptData) => {
      const state = get();
      const cfg = state.cashierPrinter;

      if (!cfg.enabled) {
        return { success: false, error: "Cashier printer is disabled in settings" };
      }

      if (!cfg.ip) {
        return { success: false, error: "Cashier printer IP address is required" };
      }

      try {
        set({ isPrinting: true });
        const options: ESCPOSOptions = {
          paperWidth: cfg.paperWidth,
          openDrawer: cfg.autoOpenDrawer && data.type === "receipt",
          cutPaper: true,
        };

        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "print-receipt",
            ip: cfg.ip,
            port: cfg.port,
            data,
            options,
          }),
        });

        const result = await res.json();
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: result.success,
            message: result.success ? "Receipt printed successfully" : result.error,
            timestamp: Date.now(),
          },
        });
        return result;
      } catch (err: any) {
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: false,
            message: err.message || "Failed to print receipt",
            timestamp: Date.now(),
          },
        });
        return { success: false, error: err.message || "Network error" };
      }
    },

    // Print Kitchen Order Ticket directly
    printKitchenTicketDirect: async (data: PrintableKitchenData) => {
      const state = get();
      const cfg = state.kitchenPrinter;

      if (!cfg.enabled) {
        return { success: false, error: "Kitchen printer is disabled in settings" };
      }

      if (!cfg.ip) {
        return { success: false, error: "Kitchen printer IP address is required" };
      }

      try {
        set({ isPrinting: true });
        const options: ESCPOSOptions = {
          paperWidth: cfg.paperWidth,
          beep: cfg.beep,
          cutPaper: true,
        };

        const res = await fetch("/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "print-kitchen",
            ip: cfg.ip,
            port: cfg.port,
            data,
            options,
          }),
        });

        const result = await res.json();
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: result.success,
            message: result.success ? "Kitchen order ticket printed" : result.error,
            timestamp: Date.now(),
          },
        });
        return result;
      } catch (err: any) {
        set({
          isPrinting: false,
          lastPrintStatus: {
            success: false,
            message: err.message || "Failed to print kitchen ticket",
            timestamp: Date.now(),
          },
        });
        return { success: false, error: err.message || "Network error" };
      }
    },
  };
});
