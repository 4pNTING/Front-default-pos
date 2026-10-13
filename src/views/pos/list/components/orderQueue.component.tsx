"use client";

import React, { useState } from "react";
import { usePOSStore, usePOSMutations } from "../../store/posStore";
import { OrderType, POSListProps, IPosOrderStatus } from "../../type/posType";

const OrderQueueComponent: React.FC<{ props: POSListProps }> = ({ props }) => {
  // Var
  const { lang, dictionary: dic } = props;

  const { updateOrderStatusMutation } = usePOSMutations();
  const {
    activeOrders,
    tables,
    selectTable,
    updateOrderStatusAPI,
    actionLoading,
  } = usePOSStore();

  const [statusFilter, setStatusFilter] = useState<string>(IPosOrderStatus.all);

  const filteredOrders = activeOrders.filter((o) => {
    if (statusFilter === IPosOrderStatus.all) return true;
    if (statusFilter === IPosOrderStatus.preparing) return o.status === IPosOrderStatus.preparing ;
    return o.status === statusFilter;
  });

  const getTableInfo = (tableId: string) => {
    return tables.find((t) => t._id === tableId);
  };

  const handleAdvanceStatus = async (order: OrderType) => {
    let nextStatus = "";
    if (order.status === IPosOrderStatus.pending) nextStatus = IPosOrderStatus.confirmed;
    else if (order.status === IPosOrderStatus.confirmed) nextStatus = IPosOrderStatus.preparing;
    else if (order.status === IPosOrderStatus.preparing || order.status === "cooking") nextStatus = IPosOrderStatus.served;

    if (nextStatus) {
      await updateOrderStatusAPI({
        orderId: order._id,
        status: nextStatus,
        mutation: updateOrderStatusMutation,
      });
    }
  };

  const handleSelectOrderTable = (order: OrderType) => {
    const table = getTableInfo(order.tableId);
    if (table) {
      selectTable({ ...table, activeOrder: order });
    }
  };

  const getStatusDisplayLabel = (status: string) => {
    switch (status) {
      case IPosOrderStatus.all:
        return dic.posPage?.statusAll ;
      case IPosOrderStatus.pending:
        return dic.posPage?.statusPending ;
      case IPosOrderStatus.confirmed:
        return dic.posPage?.statusConfirmed ;
      case IPosOrderStatus.preparing:
        return dic.posPage?.statusPreparing ;
      case IPosOrderStatus.served:
        return dic.posPage?.statusServed ;
      default:
        return status;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          IPosOrderStatus.all,
          IPosOrderStatus.pending,
          IPosOrderStatus.confirmed,
          IPosOrderStatus.preparing,
          IPosOrderStatus.served,
        ].map((status) => {
          const count =
            status === IPosOrderStatus.all
              ? activeOrders.length
              : activeOrders.filter((o) =>
                  status === IPosOrderStatus.preparing
                    ? o.status === IPosOrderStatus.preparing 
                    : o.status === status
                ).length;

          const displayLabel = getStatusDisplayLabel(status);

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                statusFilter === status
                  ? "bg-[#2F57AB] text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2F57AB]"
              }`}
            >
              {displayLabel} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-3 text-gray-400 dark:text-gray-500">
            <i className="tabler-clipboard-check text-3xl" />
          </div>
          <p className="text-sm font-medium">{dic.posPage?.noOrdersInStatus ?? "No orders in this status."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrders.map((order) => {
            const table = getTableInfo(order.tableId);

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-mono font-medium">
                        {order.orderNumber}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {dic.posPage?.table ?? "Table"} {table?.number ?? "Unknown"}
                      </h3>
                      {table?.zoneName && (
                        <span className="text-[11px] text-gray-400">
                          {table.zoneName}
                        </span>
                      )}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        order.status === IPosOrderStatus.served
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          : order.status === IPosOrderStatus.preparing 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : order.status === IPosOrderStatus.confirmed
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {order.status === IPosOrderStatus.preparing 
                        ? dic.posPage?.statusPreparing 
                        : order.status === IPosOrderStatus.confirmed
                        ? dic.posPage?.statusConfirmed 
                        : order.status === IPosOrderStatus.served
                        ? dic.posPage?.statusServed 
                        : order.status === IPosOrderStatus.pending
                        ? dic.posPage?.statusPending 
                        : order.status}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 space-y-1.5 max-h-48 overflow-y-auto">
                    {order.items?.map((item, idx) => (
                      <div
                        key={item._id ?? idx}
                        className="flex items-start justify-between text-xs"
                      >
                        <div className="flex-1 pr-2">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.quantity}× {item.menuItemName}
                          </span>
                          {item.note && (
                            <span className="text-[10px] text-amber-600 block italic">
                              {item.note}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {(item.totalPrice || 0).toLocaleString()} ₭
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer & Actions */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-500">{dic.posPage?.totalBill ?? "Total Bill:"}</span>
                    <span className="text-sm font-bold text-[#2F57AB] dark:text-blue-400">
                      {(order.total || 0).toLocaleString()} ₭
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelectOrderTable(order)}
                      className="py-1.5 px-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <i className="tabler-pencil text-xs" />
                      <span>{dic.posPage?.manage ?? "Manage"}</span>
                    </button>

                    {order.status !== IPosOrderStatus.served && (
                      <button
                        onClick={() => handleAdvanceStatus(order)}
                        disabled={actionLoading}
                        className="py-1.5 px-2 bg-[#2F57AB] hover:bg-[#25468a] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <i className="tabler-arrow-right text-xs" />
                        <span>
                          {order.status === IPosOrderStatus.pending
                            ? dic.posPage?.confirm 
                            : order.status === IPosOrderStatus.confirmed
                            ? dic.posPage?.cook 
                            : dic.posPage?.serve }
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderQueueComponent;
