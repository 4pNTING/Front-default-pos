"use client";

import React from "react";
import { ReportSummaryType } from "../../type/reportType";

interface ReportSummaryCardsProps {
  summary: ReportSummaryType;
  lang: string;
}

export const ReportSummaryCardsComponent: React.FC<ReportSummaryCardsProps> = ({ summary, lang }) => {
  const isLao = lang.startsWith("la");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Revenue Card */}
      <div className="bg-gradient-to-br from-[#0A3981] via-[#1E56A0] to-[#2F57AB] text-white p-4.5 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-100/90 font-medium tracking-wide">
            {isLao ? "ຍອດຂາຍລວມ (Total Revenue)" : "Total Revenue"}
          </p>
          <h3 className="text-2xl font-bold mt-1.5 tracking-tight">
            {summary.totalRevenue.toLocaleString()} ₭
          </h3>
          <span className="text-[11px] text-blue-200/80 mt-1 block flex items-center gap-1">
            <i className="tabler-trending-up text-xs" />
            <span>{isLao ? "ຍອດຂາຍທີ່ຊຳລະແລ້ວ" : "Paid successfully"}</span>
          </span>
        </div>
        <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/15">
          <i className="tabler-coins text-3xl" />
        </div>
      </div>

      {/* 2. Total Completed Orders */}
      <div className="bg-white dark:bg-gray-850 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {isLao ? "ຈຳນວນບິນທີ່ສຳເລັດ" : "Completed Orders"}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1.5">
            {summary.paidOrdersCount}{" "}
            <span className="text-xs font-normal text-gray-400">
              {isLao ? "ບິນ" : "orders"}
            </span>
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block flex items-center gap-1">
            <i className="tabler-check text-xs" />
            <span>{isLao ? "ສຳເລັດການຂາຍ" : "Orders finalized"}</span>
          </span>
        </div>
        <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
          <i className="tabler-receipt text-3xl" />
        </div>
      </div>

      {/* 3. Average Order Value */}
      <div className="bg-white dark:bg-gray-850 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {isLao ? "ຍອດຂາຍສະເລ່ຍ / ບິນ" : "Average Order Value"}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1.5">
            {summary.avgOrderValue.toLocaleString()} ₭
          </h3>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1 block flex items-center gap-1">
            <i className="tabler-chart-pie text-xs" />
            <span>{isLao ? "ສະເລ່ຍຕໍ່ໂຕະ / ບິນ" : "Average per ticket"}</span>
          </span>
        </div>
        <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
          <i className="tabler-calculator text-3xl" />
        </div>
      </div>

      {/* 4. Total Discounts */}
      <div className="bg-white dark:bg-gray-850 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {isLao ? "ສ່ວນຫຼຸດລວມ (Total Discount)" : "Total Discount"}
          </p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1.5">
            {summary.totalDiscount.toLocaleString()} ₭
          </h3>
          <span className="text-[11px] text-rose-500/80 font-medium mt-1 block flex items-center gap-1">
            <i className="tabler-discount-2 text-xs" />
            <span>{isLao ? "ສ່ວນຫຼຸດທີ່ມອບໃຫ້ລູກຄ້າ" : "Promotion / reductions"}</span>
          </span>
        </div>
        <div className="w-13 h-13 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/50">
          <i className="tabler-tag text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCardsComponent;
