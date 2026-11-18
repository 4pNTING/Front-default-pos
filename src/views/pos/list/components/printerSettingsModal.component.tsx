"use client";

import React, { useState } from "react";
import { usePrinterStore } from "../../store/printerStore";
import { POSListProps } from "../../type/posType";
import { ToastService } from "@/utils/toastService";

export const PrinterSettingsModalComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  const { lang } = props;
  const isLao = lang === "la";

  const {
    cashierPrinter,
    kitchenPrinter,
    isSettingsOpen,
    setSettingsOpen,
    updateCashierPrinter,
    updateKitchenPrinter,
    resetDefaults,
    testPrinter,
    printTestSlip,
    openDrawerDirect,
  } = usePrinterStore();

  const [activeTab, setActiveTab] = useState<"cashier" | "kitchen">("cashier");
  const [testingCashier, setTestingCashier] = useState(false);
  const [cashierStatus, setCashierStatus] = useState<{ connected?: boolean; latencyMs?: number; error?: string } | null>(null);

  const [testingKitchen, setTestingKitchen] = useState(false);
  const [kitchenStatus, setKitchenStatus] = useState<{ connected?: boolean; latencyMs?: number; error?: string } | null>(null);

  const [printingTest, setPrintingTest] = useState(false);
  const [openingDrawer, setOpeningDrawer] = useState(false);

  if (!isSettingsOpen) return null;

  // Handler for Cashier Ping
  const handleTestCashier = async () => {
    setTestingCashier(true);
    setCashierStatus(null);
    try {
      const res = await testPrinter(cashierPrinter.ip, cashierPrinter.port);
      if (res.success) {
        setCashierStatus({ connected: true, latencyMs: res.latencyMs });
        ToastService.success(isLao ? `ເຊື່ອມຕໍ່ສຳເລັດ (${res.latencyMs}ms)` : `เชื่อมต่อสำเร็จ (${res.latencyMs}ms)`);
      } else {
        setCashierStatus({ connected: false, error: res.error });
        ToastService.error(res.error || (isLao ? "ບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້" : "เชื่อมต่อไม่สำเร็จ"));
      }
    } finally {
      setTestingCashier(false);
    }
  };

  // Handler for Kitchen Ping
  const handleTestKitchen = async () => {
    setTestingKitchen(true);
    setKitchenStatus(null);
    try {
      const res = await testPrinter(kitchenPrinter.ip, kitchenPrinter.port);
      if (res.success) {
        setKitchenStatus({ connected: true, latencyMs: res.latencyMs });
        ToastService.success(isLao ? `ເຊື່ອມຕໍ່ສຳເລັດ (${res.latencyMs}ms)` : `เชื่อมต่อสำเร็จ (${res.latencyMs}ms)`);
      } else {
        setKitchenStatus({ connected: false, error: res.error });
        ToastService.error(res.error || (isLao ? "ບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້" : "เชื่อมต่อไม่สำเร็จ"));
      }
    } finally {
      setTestingKitchen(false);
    }
  };

  // Handler for Test Print Slip
  const handlePrintTestSlip = async (target: "cashier" | "kitchen") => {
    setPrintingTest(true);
    const targetConfig = target === "cashier" ? cashierPrinter : kitchenPrinter;
    try {
      const res = await printTestSlip(targetConfig.ip, targetConfig.port, targetConfig.paperWidth);
      if (res.success) {
        ToastService.success(isLao ? "ສົ່ງຄຳສັ່ງພິມໃບທົດສອບສຳເລັດ!" : "ส่งคำสั่งพิมพ์ใบเสร็จทดสอบสำเร็จ!");
      } else {
        ToastService.error(res.error || (isLao ? "ການພິມລົ້ມເຫຼວ" : "การพิมพ์ล้มเหลว"));
      }
    } finally {
      setPrintingTest(false);
    }
  };

  // Handler for Kick Cash Drawer
  const handleKickDrawer = async () => {
    setOpeningDrawer(true);
    try {
      const res = await openDrawerDirect(cashierPrinter.ip, cashierPrinter.port);
      if (res.success) {
        ToastService.success(isLao ? "ສົ່ງສັນຍານເປີດລີ້ນຊັກເງິນແລ້ວ!" : "ส่งสัญญาณเปิดลิ้นชักเก็บเงินแล้ว!");
      } else {
        ToastService.error(res.error || (isLao ? "ເປີດລີ້ນຊັກບໍ່ສຳເລັດ" : "เปิดลิ้นชักไม่สำเร็จ"));
      }
    } finally {
      setOpeningDrawer(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <i className="tabler-printer text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">
                {isLao ? "ຕັ້ງຄ່າເຄື່ອງພິມຄວາມຮ້ອນ (Thermal Printers)" : "ตั้งค่าเครื่องพิมพ์ความร้อน (Thermal Printers)"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isLao ? "ຮອງຮັບລະບົບເຄືອຂ່າຍ TCP Port 9100 (ESC/POS)" : "รองรับระบบเครือข่าย TCP Port 9100 (ESC/POS)"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 px-5 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("cashier")}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-xs border-b-2 transition-all ${
              activeTab === "cashier"
                ? "border-[#2F57AB] text-[#2F57AB] dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-gray-800 rounded-t-lg shadow-xs"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <i className="tabler-receipt text-base" />
            <span>{isLao ? "ເຄື່ອງພິມແຄຊເຊຍ (ໃບເສร็จ)" : "เครื่องพิมพ์แคชเชียร์ (ใบเสร็จ)"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("kitchen")}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-xs border-b-2 transition-all relative ${
              activeTab === "kitchen"
                ? "border-[#2F57AB] text-[#2F57AB] dark:text-blue-400 dark:border-blue-400 bg-white dark:bg-gray-800 rounded-t-lg shadow-xs"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <i className="tabler-tools-kitchen-2 text-base" />
            <span>{isLao ? "ເຄື່ອງພິມໃນຄົວ (ໃບສັ່ງອາຫານ)" : "เครื่องพิมพ์ในครัว (ใบสั่งอาหาร)"}</span>
            {kitchenPrinter.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 flex-1 space-y-4">
          {activeTab === "cashier" ? (
            /* ================= CASHIER PRINTER TAB ================= */
            <div className="space-y-4">
              {/* Printing Mode Switcher */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                  <span>{isLao ? "ຮູບແບບການພິມໃບເສร็จ" : "รูปแบบการพิมพ์ใบเสร็จ"}</span>
                  <span className="text-[11px] font-normal text-gray-500">
                    {cashierPrinter.mode === "network" ? "ESC/POS Port 9100" : "OS Print Preview"}
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateCashierPrinter({ mode: "network" })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      cashierPrinter.mode === "network"
                        ? "bg-[#2F57AB] text-white border-[#2F57AB] shadow-xs"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="tabler-network text-base" />
                    <div className="text-left">
                      <div>{isLao ? "ຍິງກົງຜ່ານ IP Network" : "ยิงตรงผ่าน IP Network"}</div>
                      <div className="text-[10px] opacity-80">{isLao ? "ບໍ່ມີ Dialog ກົດພິມທັນທີ" : "ไม่มี Dialog กดพิมพ์ทันที"}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateCashierPrinter({ mode: "browser" })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                      cashierPrinter.mode === "browser"
                        ? "bg-[#2F57AB] text-white border-[#2F57AB] shadow-xs"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <i className="tabler-browser text-base" />
                    <div className="text-left">
                      <div>{isLao ? "ຜ່ານ Browser Print" : "ผ่าน Browser Print"}</div>
                      <div className="text-[10px] opacity-80">{isLao ? "ເປີດໜ້າຈໍພິມຂອງລະບົບ" : "เปิดหน้าต่างพิมพ์ของระบบ"}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Network IP & Port Configuration */}
              {cashierPrinter.mode === "network" && (
                <div className="space-y-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-8 space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {isLao ? "IP Address ຂອງເຄື່ອງພິມ" : "IP Address ของเครื่องพิมพ์"}
                      </label>
                      <input
                        type="text"
                        value={cashierPrinter.ip}
                        onChange={(e) => updateCashierPrinter({ ip: e.target.value })}
                        placeholder="192.168.1.200"
                        className="w-full px-3 py-2 text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB]"
                      />
                    </div>

                    <div className="col-span-4 space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Port
                      </label>
                      <input
                        type="number"
                        value={cashierPrinter.port}
                        onChange={(e) => updateCashierPrinter({ port: Number(e.target.value) || 9100 })}
                        placeholder="9100"
                        className="w-full px-3 py-2 text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB]"
                      />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-gray-400">{isLao ? "IP ທົ່ວໄປ:" : "IP แนะนำ:"}</span>
                    {["192.168.1.200", "192.168.0.200", "192.168.1.100", "127.0.0.1"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateCashierPrinter({ ip: preset })}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-gray-300 transition-all"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Connection Test & Status */}
                  <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={handleTestCashier}
                      disabled={testingCashier}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {testingCashier ? (
                        <i className="tabler-loader animate-spin text-sm" />
                      ) : (
                        <i className="tabler-antenna-bars-5 text-sm text-blue-500" />
                      )}
                      <span>{isLao ? "ທົດສອບເຊື່ອມຕໍ່ (Ping)" : "ทดสอบเชื่อมต่อ (Ping)"}</span>
                    </button>

                    {cashierStatus && (
                      <div className="text-xs font-medium">
                        {cashierStatus.connected ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <i className="tabler-circle-check text-sm" />
                            {isLao ? `ເຊື່ອມຕໍ່ໄດ້ (${cashierStatus.latencyMs}ms)` : `เชื่อมต่อได้ (${cashierStatus.latencyMs}ms)`}
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1" title={cashierStatus.error}>
                            <i className="tabler-circle-x text-sm" />
                            {isLao ? "ເຊື່ອມຕໍ່ບໍ່ໄດ້" : "เชื่อมต่อไม่สำเร็จ"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Paper Width & Automation Options */}
              <div className="space-y-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {isLao ? "ຂະໜາດເຈ້ຍຄວາມຮ້ອນ" : "ขนาดกระดาษความร้อน"}
                  </span>
                  <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs">
                    <button
                      type="button"
                      onClick={() => updateCashierPrinter({ paperWidth: "80mm" })}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        cashierPrinter.paperWidth === "80mm"
                          ? "bg-white dark:bg-gray-700 text-[#2F57AB] dark:text-blue-400 shadow-xs"
                          : "text-gray-500"
                      }`}
                    >
                      80mm (ມາດຕະຖານ)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCashierPrinter({ paperWidth: "58mm" })}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        cashierPrinter.paperWidth === "58mm"
                          ? "bg-white dark:bg-gray-700 text-[#2F57AB] dark:text-blue-400 shadow-xs"
                          : "text-gray-500"
                      }`}
                    >
                      58mm (ຂະໜາດນ້ອຍ)
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {isLao ? "ເປີດລີ້ນຊັກເງິນສົດອັດຕະໂນມັດ (Cash Drawer Kick)" : "เปิดลิ้นชักเก็บเงินสดอัตโนมัติ (Cash Drawer Kick)"}
                    </span>
                    <input
                      type="checkbox"
                      checked={cashierPrinter.autoOpenDrawer}
                      onChange={(e) => updateCashierPrinter({ autoOpenDrawer: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {isLao ? "ພິມໃບເສร็จອັດຕະໂນມັດເມື່ອຊຳລະເງິນສຳເລັດ" : "พิมพ์ใบเสร็จอัตโนมัติเมื่อชำระเงินสำเร็จ"}
                    </span>
                    <input
                      type="checkbox"
                      checked={cashierPrinter.autoPrintOnPayment}
                      onChange={(e) => updateCashierPrinter({ autoPrintOnPayment: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                  </label>
                </div>
              </div>

              {/* Hardware Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handlePrintTestSlip("cashier")}
                  disabled={printingTest}
                  className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {printingTest ? (
                    <i className="tabler-loader animate-spin text-sm" />
                  ) : (
                    <i className="tabler-printer text-sm" />
                  )}
                  <span>{isLao ? "ທົດສອບພິມໃບເສร็จ" : "ทดสอบพิมพ์ใบเสร็จ"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleKickDrawer}
                  disabled={openingDrawer}
                  className="flex-1 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {openingDrawer ? (
                    <i className="tabler-loader animate-spin text-sm" />
                  ) : (
                    <i className="tabler-coin text-sm" />
                  )}
                  <span>{isLao ? "ທົດສອບເປີດລີ້ນຊັກ" : "ทดสอบเปิดลิ้นชัก"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= KITCHEN PRINTER TAB ================= */
            <div className="space-y-4">
              {/* Kitchen Printer Enable Toggle */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    {isLao ? "ເປີດໃຊ້ງານເຄື່ອງພິມໃນຄົວ" : "เปิดใช้งานเครื่องพิมพ์ในครัว"}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {isLao ? "ພິມໃບສັ່ງອາຫານເຂົ້າຄົວອັດຕະໂນມັດເມື່ອກົດສັ່ງ" : "พิมพ์ใบสั่งอาหารเข้าครัวอัตโนมัติเมื่อกดสั่ง"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kitchenPrinter.enabled}
                    onChange={(e) => updateKitchenPrinter({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2F57AB]"></div>
                </label>
              </div>

              {kitchenPrinter.enabled ? (
                <div className="space-y-4">
                  {/* Network IP & Port */}
                  <div className="space-y-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-8 space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {isLao ? "IP Address ຂອງເຄື່ອງພິມຄົວ" : "IP Address ของเครื่องพิมพ์ครัว"}
                        </label>
                        <input
                          type="text"
                          value={kitchenPrinter.ip}
                          onChange={(e) => updateKitchenPrinter({ ip: e.target.value })}
                          placeholder="192.168.1.201"
                          className="w-full px-3 py-2 text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB]"
                        />
                      </div>

                      <div className="col-span-4 space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          Port
                        </label>
                        <input
                          type="number"
                          value={kitchenPrinter.port}
                          onChange={(e) => updateKitchenPrinter({ port: Number(e.target.value) || 9100 })}
                          placeholder="9100"
                          className="w-full px-3 py-2 text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#2F57AB]"
                        />
                      </div>
                    </div>

                    {/* Quick IP Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-gray-400">{isLao ? "IP ທົ່ວໄປ:" : "IP แนะนำ:"}</span>
                      {["192.168.1.201", "192.168.0.201", "192.168.1.101"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => updateKitchenPrinter({ ip: preset })}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-gray-300 transition-all"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {/* Connection Test */}
                    <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={handleTestKitchen}
                        disabled={testingKitchen}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {testingKitchen ? (
                          <i className="tabler-loader animate-spin text-sm" />
                        ) : (
                          <i className="tabler-antenna-bars-5 text-sm text-blue-500" />
                        )}
                        <span>{isLao ? "ທົດສອບເຊື່ອມຕໍ່ (Ping)" : "ทดสอบเชื่อมต่อ (Ping)"}</span>
                      </button>

                      {kitchenStatus && (
                        <div className="text-xs font-medium">
                          {kitchenStatus.connected ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <i className="tabler-circle-check text-sm" />
                              {isLao ? `ເຊື່ອມຕໍ່ໄດ້ (${kitchenStatus.latencyMs}ms)` : `เชื่อมต่อได้ (${kitchenStatus.latencyMs}ms)`}
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1" title={kitchenStatus.error}>
                              <i className="tabler-circle-x text-sm" />
                              {isLao ? "ເຊື່ອມຕໍ່ບໍ່ໄດ້" : "เชื่อมต่อไม่สำเร็จ"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kitchen Options */}
                  <div className="space-y-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {isLao ? "ຂະໜາດເຈ້ຍຄົວ" : "ขนาดกระดาษครัว"}
                      </span>
                      <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs">
                        <button
                          type="button"
                          onClick={() => updateKitchenPrinter({ paperWidth: "80mm" })}
                          className={`px-3 py-1 rounded-md font-semibold transition-all ${
                            kitchenPrinter.paperWidth === "80mm"
                              ? "bg-white dark:bg-gray-700 text-[#2F57AB] dark:text-blue-400 shadow-xs"
                              : "text-gray-500"
                          }`}
                        >
                          80mm
                        </button>
                        <button
                          type="button"
                          onClick={() => updateKitchenPrinter({ paperWidth: "58mm" })}
                          className={`px-3 py-1 rounded-md font-semibold transition-all ${
                            kitchenPrinter.paperWidth === "58mm"
                              ? "bg-white dark:bg-gray-700 text-[#2F57AB] dark:text-blue-400 shadow-xs"
                              : "text-gray-500"
                          }`}
                        >
                          58mm
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {isLao ? "ພິມໃບສັ່ງຄົວອັດຕະໂນມັດເມື່ອກົດ 'ສົ່ງອໍເດີ'" : "พิมพ์ใบสั่งครัวอัตโนมัติเมื่อกด 'ส่งออเดอร์'"}
                        </span>
                        <input
                          type="checkbox"
                          checked={kitchenPrinter.autoPrintOnOrder}
                          onChange={(e) => updateKitchenPrinter({ autoPrintOnOrder: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {isLao ? "ສົ່ງສຽງປີ໊ບ/ກຣິ່ງເຕືອນພໍ່ຄົວ (Beeper alert)" : "ส่งเสียงปี๊บ/กริ่งเตือนพ่อครัว (Beeper alert)"}
                        </span>
                        <input
                          type="checkbox"
                          checked={kitchenPrinter.beep}
                          onChange={(e) => updateKitchenPrinter({ beep: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Kitchen Test Print Button */}
                  <button
                    type="button"
                    onClick={() => handlePrintTestSlip("kitchen")}
                    disabled={printingTest}
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {printingTest ? (
                      <i className="tabler-loader animate-spin text-sm" />
                    ) : (
                      <i className="tabler-tools-kitchen-2 text-sm" />
                    )}
                    <span>{isLao ? "ທົດສອບພິມໃບສັ່ງຄົວ" : "ทดสอบพิมพ์ใบสั่งครัว"}</span>
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400 text-xs border border-dashed rounded-xl space-y-1">
                  <i className="tabler-printer-off text-2xl text-gray-300 dark:text-gray-600" />
                  <p>{isLao ? "ເຄື່ອງພິມໃນຄົວຖືກປິດໃຊ້ງານຢູ່" : "เครื่องพิมพ์ในครัวถูกปิดใช้งานอยู่"}</p>
                  <p className="text-[10px] text-gray-400">
                    {isLao ? "ເປີດສະວິດດ້ານເທິງເພື່ອຕັ້ງຄ່າການພິມບິນເຂົ້າຄົວ" : "เปิดสวิตช์ด้านบนเพื่อตั้งค่าการพิมพ์บิลเข้าห้องครัว"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
          >
            {isLao ? "ຄືນຄ່າເລີ່ມຕົ້ນ" : "คืนค่าเริ่มต้น"}
          </button>

          <button
            type="button"
            onClick={() => {
              setSettingsOpen(false);
              ToastService.success(isLao ? "ບັນທຶກການຕັ້ງຄ່າເຄື່ອງພິມແລ້ວ" : "บันทึกการตั้งค่าเครื่องพิมพ์แล้ว");
            }}
            className="px-5 py-2 bg-[#2F57AB] hover:bg-[#25468a] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            {isLao ? "ປິດ ແລະ ບັນທຶກ" : "ปิดและบันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrinterSettingsModalComponent;
