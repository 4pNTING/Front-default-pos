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

  const [activeTab, setActiveTab] = useState<"cashier" | "kitchen" | "branding">("cashier");
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
        let successMsg = `เชื่อมต่อสำเร็จ (${res.latencyMs}ms)`;
        if (isLao) {
          successMsg = `ເຊື່ອມຕໍ່ສຳເລັດ (${res.latencyMs}ms)`;
        }
        ToastService.success(successMsg);
      } else {
        setCashierStatus({ connected: false, error: res.error });
        let failMsg = res.error;
        if (!failMsg) {
          failMsg = isLao ? "ບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້" : "เชื่อมต่อไม่สำเร็จ";
        }
        ToastService.error(failMsg);
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
        let successMsg = `เชื่อมต่อสำเร็จ (${res.latencyMs}ms)`;
        if (isLao) {
          successMsg = `ເຊື່ອມຕໍ່ສຳເລັດ (${res.latencyMs}ms)`;
        }
        ToastService.success(successMsg);
      } else {
        setKitchenStatus({ connected: false, error: res.error });
        let failMsg = res.error;
        if (!failMsg) {
          failMsg = isLao ? "ບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້" : "เชื่อมต่อไม่สำเร็จ";
        }
        ToastService.error(failMsg);
      }
    } finally {
      setTestingKitchen(false);
    }
  };

  // Handler for Test Print Slip
  const handlePrintTestSlip = async (target: "cashier" | "kitchen") => {
    setPrintingTest(true);
    let targetConfig = cashierPrinter;
    let targetTitle = "Cashier Receipt Printer";
    if (target === "kitchen") {
      targetConfig = kitchenPrinter as any;
      targetTitle = "Kitchen Order Printer";
    }

    try {
      const res = await printTestSlip(
        targetConfig.ip,
        targetConfig.port,
        targetConfig.paperWidth,
        targetTitle
      );
      if (res.success) {
        let msg = isLao ? "ສົ່ງຄຳສັ່ງພິມໃບທົດສອບສຳເລັດ!" : "ส่งคำสั่งพิมพ์ใบเสร็จทดสอบสำเร็จ!";
        ToastService.success(msg);
      } else {
        let msg = res.error;
        if (!msg) {
          msg = isLao ? "ການພິມລົ້ມເຫຼວ" : "การพิมพ์ล้มเหลว";
        }
        ToastService.error(msg);
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
        let msg = isLao ? "ສົ່ງສັນຍານເປີດລີ້ນຊັກເງິນແລ້ວ!" : "ส่งสัญญาณเปิดลิ้นชักเก็บเงินแล้ว!";
        ToastService.success(msg);
      } else {
        let msg = res.error;
        if (!msg) {
          msg = isLao ? "ເປີດລີ້ນຊັກບໍ່ສຳເລັດ" : "เปิดลิ้นชักไม่สำเร็จ";
        }
        ToastService.error(msg);
      }
    } finally {
      setOpeningDrawer(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
              <i className="tabler-printer" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isLao ? "ຕັ້ງຄ່າເຄື່ອງພິມໃບບິນ (Thermal POS)" : "ตั้งค่าเครื่องพิมพ์ใบเสร็จ (Thermal POS)"}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                {isLao
                  ? "ຮອງຮັບ Direct ESC/POS Port 9100 ແລະ ລະບົບພິມ Browser"
                  : "รองรับ Direct ESC/POS Port 9100 และระบบพิมพ์ Browser"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab("cashier")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "cashier"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <i className="tabler-receipt text-sm" />
            <span>{isLao ? "ເຄື່ອງພິມແຄຊເຊຍ (Cashier)" : "เครื่องพิมพ์แคชเชียร์"}</span>
          </button>

          <button
            onClick={() => setActiveTab("kitchen")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "kitchen"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <i className="tabler-soup text-sm" />
            <span>{isLao ? "ເຄື່ອງພິມຫ້ອງຄົວ (Kitchen)" : "เครื่องพิมพ์ห้องครัว"}</span>
          </button>

          <button
            onClick={() => setActiveTab("branding")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "branding"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <i className="tabler-building-store text-sm" />
            <span>{isLao ? "ຂໍ້ມູນຮ້ານ & ຫົວບິນ" : "ข้อมูลร้าน & หัวบิล"}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: Cashier Printer */}
          {activeTab === "cashier" && (
            <div className="space-y-4">
              {/* Enable Toggle & Mode */}
              <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                      {isLao ? "ເປີດໃຊ້ງານເຄື່ອງພິມແຄຊເຊຍ" : "เปิดใช้งานเครื่องพิมพ์แคชเชียร์"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isLao ? "ພິມໃບຮັບເງິນ / ໃບແຈ້ງລາຄາ" : "พิมพ์ใบเสร็จรับเงิน / ใบแจ้งยอด"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cashierPrinter.enabled}
                      onChange={(e) => updateCashierPrinter({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>

                {/* Print Mode Selector */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                    {isLao ? "ຮູບແບບການພິມ (Print Mode)" : "โหมดการพิมพ์"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateCashierPrinter({ mode: "network" })}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        cashierPrinter.mode === "network"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className="tabler-network text-base" />
                        <span className="text-xs font-bold">Direct Network ESC/POS</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {isLao
                          ? "ຍິງກົງໄປທີ່ IP:Port 9100 ບໍ່ຜ່ານ Browser"
                          : "ส่งคำสั่งตรงไปที่ IP:9100 ทันที ไม่ผ่าน Dialog"}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateCashierPrinter({ mode: "browser" })}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        cashierPrinter.mode === "browser"
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <i className="tabler-browser text-base" />
                        <span className="text-xs font-bold">Browser Print Dialog</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {isLao
                          ? "ພິມຜ່ານໜ້າຕ່າງຂອງບຣາວເຊີ (USB / Bluetooth)"
                          : "พิมพ์ผ่านหน้าต่างเบราว์เซอร์ (รองรับ USB/ไดรเวอร์)"}
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Network Parameters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    {isLao ? "IP Address ຂອງເຄື່ອງພິມ" : "IP Address เครื่องพิมพ์"}
                  </label>
                  <input
                    type="text"
                    value={cashierPrinter.ip}
                    onChange={(e) => updateCashierPrinter({ ip: e.target.value.trim() })}
                    placeholder="192.168.1.200"
                    className="w-full text-xs font-mono px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    Port (TCP)
                  </label>
                  <input
                    type="number"
                    value={cashierPrinter.port}
                    onChange={(e) => updateCashierPrinter({ port: Number(e.target.value) || 9100 })}
                    placeholder="9100"
                    className="w-full text-xs font-mono px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Paper Width & Automation Settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    {isLao ? "ຂະໜາດເຈ້ຍ (Paper Width)" : "ขนาดกระดาษความร้อน"}
                  </label>
                  <select
                    value={cashierPrinter.paperWidth}
                    onChange={(e) => updateCashierPrinter({ paperWidth: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  >
                    <option value="80mm">80mm (Standard POS - 48 cols)</option>
                    <option value="58mm">58mm (Compact Mini - 32 cols)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={cashierPrinter.autoOpenDrawer}
                      onChange={(e) => updateCashierPrinter({ autoOpenDrawer: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>{isLao ? "ເປີດລີ້ນຊັກເງິນອັດຕະໂນມັດ" : "เด้งลิ้นชักเก็บเงินอัตโนมัติ"}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={cashierPrinter.autoPrintOnPayment}
                      onChange={(e) => updateCashierPrinter({ autoPrintOnPayment: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>{isLao ? "ພິມໃບຮັບເງິນທັນທີຫຼັງຊຳລະ" : "พิมพ์ใบเสร็จอัตโนมัติหลังรับชำระ"}</span>
                  </label>
                </div>
              </div>

              {/* Connection Status Indicator */}
              {cashierStatus && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center justify-between border ${
                    cashierStatus.connected
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                      : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cashierStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                      }`}
                    />
                    <span className="font-semibold">
                      {cashierStatus.connected
                        ? `Connected to ${cashierPrinter.ip}:${cashierPrinter.port} (${cashierStatus.latencyMs}ms)`
                        : `Connection Failed: ${cashierStatus.error}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Diagnostic Action Buttons */}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleTestCashier}
                  disabled={testingCashier}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <i className={`tabler-antenna ${testingCashier ? "animate-spin" : ""}`} />
                  <span>
                    {testingCashier
                      ? isLao ? "ກຳລັງທົດສອບ..." : "กำลังทดสอบ..."
                      : isLao ? "ທົດສອບການເຊື່ອມຕໍ່ (Ping)" : "ทดสอบการเชื่อมต่อ (Ping)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintTestSlip("cashier")}
                  disabled={printingTest}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 border border-blue-200 dark:border-blue-800"
                >
                  <i className="tabler-printer text-sm" />
                  <span>{isLao ? "ພິມໃບທົດສອບ (Test Slip)" : "พิมพ์ใบเสร็จทดสอบ (Test Slip)"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleKickDrawer}
                  disabled={openingDrawer}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 border border-amber-200 dark:border-amber-800"
                >
                  <i className="tabler-cash text-sm" />
                  <span>{isLao ? "ທົດສອບເປີດລີ້ນຊັກ (Open Drawer)" : "ทดสอบเด้งลิ้นชัก (Open Drawer)"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Kitchen Printer */}
          {activeTab === "kitchen" && (
            <div className="space-y-4">
              {/* Enable Toggle */}
              <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                    {isLao ? "ເປີດໃຊ້ງານເຄື່ອງພິມຫ້ອງຄົວ" : "เปิดใช้งานเครื่องพิมพ์ห้องครัว"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isLao ? "ພິມໃບສັ່ງອາຫານໃຫ້ພໍ່ຄົວເມື່ອກົດສັ່ງ" : "พิมพ์ใบสั่งอาหารเข้าครัวอัตโนมัติเมื่อส่งออเดอร์"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kitchenPrinter.enabled}
                    onChange={(e) => updateKitchenPrinter({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {/* Network Parameters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    {isLao ? "IP Address ຂອງເຄື່ອງພິມຫ້ອງຄົວ" : "IP Address เครื่องพิมพ์ครัว"}
                  </label>
                  <input
                    type="text"
                    value={kitchenPrinter.ip}
                    onChange={(e) => updateKitchenPrinter({ ip: e.target.value.trim() })}
                    placeholder="192.168.1.201"
                    className="w-full text-xs font-mono px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    Port (TCP)
                  </label>
                  <input
                    type="number"
                    value={kitchenPrinter.port}
                    onChange={(e) => updateKitchenPrinter({ port: Number(e.target.value) || 9100 })}
                    placeholder="9100"
                    className="w-full text-xs font-mono px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Kitchen Features */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    {isLao ? "ຂະໜາດເຈ້ຍ (Paper Width)" : "ขนาดกระดาษ"}
                  </label>
                  <select
                    value={kitchenPrinter.paperWidth}
                    onChange={(e) => updateKitchenPrinter({ paperWidth: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  >
                    <option value="80mm">80mm (Standard POS - 48 cols)</option>
                    <option value="58mm">58mm (Compact Mini - 32 cols)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={kitchenPrinter.autoPrintOnOrder}
                      onChange={(e) => updateKitchenPrinter({ autoPrintOnOrder: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>{isLao ? "ພິມອັດຕະໂນມັດເມື່ອກົດສັ່ງ" : "พิมพ์ใบเข้าครัวอัตโนมัติเมื่อกดสั่ง"}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={kitchenPrinter.beep}
                      onChange={(e) => updateKitchenPrinter({ beep: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>{isLao ? "ສົ່ງສຽງເຕືອນ (Buzzer Beep)" : "ส่งเสียงเตือน Buzzer ในครัว"}</span>
                  </label>
                </div>
              </div>

              {/* Connection Status Indicator */}
              {kitchenStatus && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center justify-between border ${
                    kitchenStatus.connected
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                      : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        kitchenStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                      }`}
                    />
                    <span className="font-semibold">
                      {kitchenStatus.connected
                        ? `Connected to ${kitchenPrinter.ip}:${kitchenPrinter.port} (${kitchenStatus.latencyMs}ms)`
                        : `Connection Failed: ${kitchenStatus.error}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Kitchen Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestKitchen}
                  disabled={testingKitchen}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <i className={`tabler-antenna ${testingKitchen ? "animate-spin" : ""}`} />
                  <span>
                    {testingKitchen
                      ? isLao ? "ກຳລັງທົດສອບ..." : "กำลังทดสอบ..."
                      : isLao ? "ທົດສອບການເຊື່ອມຕໍ່ (Ping)" : "ทดสอบการเชื่อมต่อ (Ping)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintTestSlip("kitchen")}
                  disabled={printingTest}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 border border-blue-200 dark:border-blue-800"
                >
                  <i className="tabler-soup text-sm" />
                  <span>{isLao ? "ພິມໃບທົດສອບຫ້ອງຄົວ" : "พิมพ์ใบสั่งครัวทดสอบ"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Store & Receipt Branding */}
          {activeTab === "branding" && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                  {isLao ? "ຊື່ຮ້ານ / ຫົວບິນ" : "ชื่อร้านบนหัวบิล"}
                </label>
                <input
                  type="text"
                  value={cashierPrinter.shopName}
                  onChange={(e) => updateCashierPrinter({ shopName: e.target.value })}
                  placeholder="LAO WORLD RESTAURANT"
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    {isLao ? "ທີ່ຢູ່ຮ້ານ" : "ที่อยู่ร้านค้า"}
                  </label>
                  <input
                    type="text"
                    value={cashierPrinter.shopAddress}
                    onChange={(e) => updateCashierPrinter({ shopAddress: e.target.value })}
                    placeholder="Vientiane, Lao PDR"
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                    {isLao ? "ເບີໂທລະສັບ" : "เบอร์โทรศัพท์ร้าน"}
                  </label>
                  <input
                    type="text"
                    value={cashierPrinter.shopPhone}
                    onChange={(e) => updateCashierPrinter({ shopPhone: e.target.value })}
                    placeholder="+856 20 5555 9999"
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                  {isLao ? "ຂໍ້ຄວາມຕ້ອນຮັບ (Header Slogan)" : "ข้อความต้อนรับหัวบิล (Header Note)"}
                </label>
                <input
                  type="text"
                  value={cashierPrinter.headerText}
                  onChange={(e) => updateCashierPrinter({ headerText: e.target.value })}
                  placeholder="ยินดีต้อนรับ / ຍິນດີຕ້ອນຮັບ"
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                  {isLao ? "ຂໍ້ຄວາມຂອບໃຈ (Footer Message)" : "ข้อความขอบคุณท้ายบิล (Footer Message)"}
                </label>
                <input
                  type="text"
                  value={cashierPrinter.footerText}
                  onChange={(e) => updateCashierPrinter({ footerText: e.target.value })}
                  placeholder="THANK YOU / ຂໍຂອບໃຈທີ່ມາໃຊບໍລິການ"
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                    {isLao ? "ພິມ QR Code ທ້າຍບິນ (e-Receipt / Website)" : "พิมพ์ QR Code ท้ายบิล (e-Receipt / รีวิว)"}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {cashierPrinter.qrCodeUrl || "None"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cashierPrinter.showQrCode}
                    onChange={(e) => updateCashierPrinter({ showQrCode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <i className="tabler-rotate-dot text-sm" />
            <span>{isLao ? "ຣີເຊັດຄ່າເລີ່ມຕົ້ນ" : "รีเซ็ตค่าเริ่มต้น"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              {isLao ? "ສຳເລັດ" : "บันทึก & เสร็จสิ้น"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinterSettingsModalComponent;
