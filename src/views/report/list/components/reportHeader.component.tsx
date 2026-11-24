"use client";

import React from "react";
import { DateRangePreset } from "../../type/reportType";

interface ReportHeaderProps {
  lang: string;
  datePreset: DateRangePreset;
  setDatePreset: (preset: DateRangePreset) => void;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
  onRefresh: () => void;
  onExportCsv: () => void;
  loading: boolean;
}

export const ReportHeaderComponent: React.FC<ReportHeaderProps> = ({
  lang,
  datePreset,
  setDatePreset,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  onRefresh,
  onExportCsv,
  loading,
}) => {
  const isLao = lang.startsWith("la");

  const getPresetLabel = (preset: DateRangePreset): string => {
    if (preset === "today") {
      return isLao ? "ມື້ນີ້" : "Today";
    }
    if (preset === "yesterday") {
      return isLao ? "ມື້ວານ" : "Yesterday";
    }
    if (preset === "week") {
      return isLao ? "7 ມື້ຜ່ານມາ" : "Last 7 Days";
    }
    if (preset === "month") {
      return isLao ? "ເດືອນນີ້" : "This Month";
    }
    if (preset === "all") {
      return isLao ? "ທັງໝົດ" : "All Time";
    }
    return isLao ? "ກຳນົດເອງ" : "Custom";
  };

  const presets: DateRangePreset[] = ["today", "yesterday", "week", "month", "all", "custom"];

  return (
    <div className="bg-white dark:bg-gray-850 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs space-y-4">
      {/* Top row: Title, Subtitle, Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A3981] to-[#2F57AB] text-white flex items-center justify-center shadow-sm">
              <i className="tabler-chart-histogram text-xl" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {isLao ? "ລາຍງານຍອດຂາຍ & ປະຫວັດບິນ" : "Sales & Order Reports"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isLao
                  ? "ສະຫຼຸບລວມຍອດຂາຍ, ວິເຄາະສິນຄ້າຂາຍດີ ແລະ ປະຫວັດບິນທັງໝົດ"
                  : "Comprehensive sales analytics, revenue metrics, and order history"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Refresh + Export CSV */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
            title={isLao ? "ໂຫຼດຂໍ້ມູນໃໝ່" : "Refresh data"}
          >
            <i className={`tabler-refresh text-base ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isLao ? "ໂຫຼດຂໍ້ມູນໃໝ່" : "Refresh"}</span>
          </button>

          <button
            onClick={onExportCsv}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title={isLao ? "ດາວໂຫຼດໄຟລ໌ Excel / CSV" : "Export to CSV"}
          >
            <i className="tabler-file-spreadsheet text-base" />
            <span>{isLao ? "ສົ່ງອອກ CSV (Excel)" : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Date Range Pills & Custom Date Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        {/* Preset Range Buttons */}
        <div className="inline-flex flex-wrap p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 gap-1 text-xs font-medium">
          {presets.map((preset) => {
            const isActive = datePreset === preset;
            return (
              <button
                key={preset}
                onClick={() => setDatePreset(preset)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#2F57AB] text-white shadow-2xs font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {getPresetLabel(preset)}
              </button>
            );
          })}
        </div>

        {/* Custom Date Pickers (Shown if preset === 'custom') */}
        {datePreset === "custom" && (
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-medium">{isLao ? "ເລີ່ມ:" : "From:"}</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs outline-none focus:border-[#2F57AB]"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-medium">{isLao ? "ຫາ:" : "To:"}</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs outline-none focus:border-[#2F57AB]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHeaderComponent;
