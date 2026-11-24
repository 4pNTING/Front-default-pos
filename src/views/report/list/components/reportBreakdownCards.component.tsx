"use client";

import React from "react";
import { TopSellingItemType, ReportSummaryType } from "../../type/reportType";

interface ReportBreakdownCardsProps {
  topItems: TopSellingItemType[];
  summary: ReportSummaryType;
  lang: string;
}

export const ReportBreakdownCardsComponent: React.FC<ReportBreakdownCardsProps> = ({
  topItems,
  summary,
  lang,
}) => {
  const isLao = lang.startsWith("la");

  const totalAllOrders = summary.paidOrdersCount + summary.cancelledOrdersCount;
  const paidPercent = totalAllOrders > 0 ? Math.round((summary.paidOrdersCount / totalAllOrders) * 100) : 100;
  const cancelledPercent = totalAllOrders > 0 ? 100 - paidPercent : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
      {/* Left (2 Cols): Top 5 Best-Selling Dishes */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-850 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <i className="tabler-crown text-lg" />
              </div>
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                {isLao ? "5 ອັນດັບອາຫານຂາຍດີທີ່ສຸດ" : "Top 5 Best-Selling Dishes"}
              </h4>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {isLao ? "ຈັດອັນດັບຕາມຍອດຂາຍ" : "Ranked by sales volume"}
            </span>
          </div>

          {topItems.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              <i className="tabler-tools-kitchen-2 text-2xl mb-1 block" />
              <span>{isLao ? "ບໍ່ມີຂໍ້ມູນລາຍການອາຫານໃນຊ່ວງເວລານີ້" : "No item sales in this period"}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, index) => {
                const rank = index + 1;
                let badgeColor = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
                if (rank === 1) {
                  badgeColor = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
                } else if (rank === 2) {
                  badgeColor = "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
                } else if (rank === 3) {
                  badgeColor = "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";
                }

                return (
                  <div key={item.menuItemId || index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${badgeColor}`}>
                          {rank}
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {item.menuItemName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-medium">
                          {item.quantity} {isLao ? "ຈານ" : "qty"}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.totalRevenue.toLocaleString()} ₭
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#2F57AB] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right (1 Col): Order Status Summary & Quick Stats */}
      <div className="bg-white dark:bg-gray-850 p-4.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <i className="tabler-chart-donut text-lg" />
            </div>
            <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">
              {isLao ? "ສະຖານະບິນ (Bill Status)" : "Order Status Distribution"}
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            {/* Paid Orders */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  {isLao ? "ຊຳລະເງິນສຳເລັດ" : "Paid & Finalized"}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {summary.paidOrdersCount} ({paidPercent}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>
            </div>

            {/* Cancelled Orders */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  {isLao ? "ຍົກເລີກບິນ (Cancelled)" : "Cancelled"}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {summary.cancelledOrdersCount} ({cancelledPercent}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full"
                  style={{ width: `${cancelledPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 mt-2 space-y-1.5 text-[11px] text-gray-500">
              <div className="flex justify-between">
                <span>{isLao ? "ຈຳນວນບິນທັງໝົດ:" : "Total Orders Recorded:"}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{totalAllOrders}</span>
              </div>
              <div className="flex justify-between">
                <span>{isLao ? "ອັດຕາຊຳລະສຳເລັດ:" : "Completion Rate:"}</span>
                <span className="font-bold text-emerald-600">{paidPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBreakdownCardsComponent;
