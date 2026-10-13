"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { usePOSStore } from "../store/posStore";
import { useLazyQuery } from "@apollo/client";
import { POSListProps, IPosViewMode } from "../type/posType";
import { LOAD_TABLE } from "@/gql/queries/table";
import { LOAD_ZONE } from "@/gql/queries/zone";
import { LOAD_CATEGORY } from "@/gql/queries/category";
import { LOAD_MENU_ITEM } from "@/gql/queries/menuItem";
import { LOAD_ORDER, LOAD_CURRENCIES } from "@/gql/queries/order";
import { ToastService } from "@/utils/toastService";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import MenuComponent from "./components/menu.component";
import CartComponent from "./components/cart.component";
import PaymentComponent from "./components/payment.component";
import OrderQueueComponent from "./components/orderQueue.component";
import ReceiptModalComponent from "./components/receiptModal.component";
import MoveTableModalComponent from "./components/moveTableModal.component";

export const POSList: React.FC<{ props: POSListProps }> = ({ props }) => {
  // Var
  const { lang, dictionary: dic } = props;
  const { viewMode, setMasterData, setLoading, setRefreshMasterData, setSilentRefresh } = usePOSStore();

  const isRefreshingRef = useRef(false);

  // GraphQL Lazy Queries called at page level like zoneList
  const [loadTableCall] = useLazyQuery(LOAD_TABLE, { fetchPolicy: "network-only" });
  const [loadZoneCall] = useLazyQuery(LOAD_ZONE, { fetchPolicy: "network-only" });
  const [loadCategoryCall] = useLazyQuery(LOAD_CATEGORY, { fetchPolicy: "network-only" });
  const [loadMenuItemCall] = useLazyQuery(LOAD_MENU_ITEM, { fetchPolicy: "network-only" });
  const [loadOrderCall] = useLazyQuery(LOAD_ORDER, { fetchPolicy: "network-only" });
  const [loadCurrenciesCall] = useLazyQuery(LOAD_CURRENCIES, { fetchPolicy: "network-only" });

  // Full load — initial page open only (shows Loading spinner)
  const loadMasterDataCall = useCallback(async () => {
    try {
      setLoading(true);

      const [tablesRes, zonesRes, categoriesRes, menuItemsRes, ordersRes, currenciesRes] =
        await Promise.all([
          loadTableCall({ variables: { input: { limit: 100, isActive: "active" } } }),
          loadZoneCall({ variables: { input: { limit: 100, isActive: "active" } } }),
          loadCategoryCall({ variables: { input: { limit: 100, isActive: "active" } } }),
          loadMenuItemCall({ variables: { input: { limit: 200, isActive: "active" } } }),
          loadOrderCall({ variables: { input: { limit: 100 } } }),
          loadCurrenciesCall({ variables: { input: { limit: 20, isActive: "active" } } }),
        ]);

      setMasterData({
        rawTables: tablesRes.data?.loadTable?.table ?? [],
        zones: zonesRes.data?.loadZone?.zone ?? [],
        categories: categoriesRes.data?.loadCategory?.category ?? [],
        menuItems: menuItemsRes.data?.loadMenuItem?.menuItem ?? [],
        allOrders: ordersRes.data?.loadOrder?.order ?? [],
        currencies: currenciesRes.data?.loadCurrencies?.currency ?? [],
      });
    } catch (err: any) {
      ToastService.error(err.message ?? "Failed to load POS data");
    } finally {
      setLoading(false);
    }
  }, [
    loadTableCall,
    loadZoneCall,
    loadCategoryCall,
    loadMenuItemCall,
    loadOrderCall,
    loadCurrenciesCall,
    setMasterData,
    setLoading,
  ]);

  // Silent refresh — after save/update/cancel/transfer/auto-poll (NO spinner, only tables + orders)
  const silentRefreshCall = useCallback(async () => {
    if (isRefreshingRef.current) return;
    const state = usePOSStore.getState();
    if (state.actionLoading) return;

    try {
      isRefreshingRef.current = true;
      const [tablesRes, ordersRes] = await Promise.all([
        loadTableCall({ variables: { input: { limit: 100, isActive: "active" } } }),
        loadOrderCall({ variables: { input: { limit: 100 } } }),
      ]);

      const currentState = usePOSStore.getState();
      setMasterData({
        rawTables: tablesRes.data?.loadTable?.table ?? [],
        zones: currentState.zones,
        categories: currentState.categories,
        menuItems: currentState.menuItems,
        allOrders: ordersRes.data?.loadOrder?.order ?? [],
        currencies: currentState.currencies,
      });
    } catch (err: any) {
      console.error("Silent refresh failed:", err);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [loadTableCall, loadOrderCall, setMasterData]);

  // Register callbacks and initial full load
  useEffect(() => {
    setRefreshMasterData(loadMasterDataCall);
    setSilentRefresh(silentRefreshCall);
    loadMasterDataCall();
  }, [loadMasterDataCall, silentRefreshCall, setRefreshMasterData, setSilentRefresh]);

  // Background Auto-Refresh (Polling every 15 seconds)
  useEffect(() => {
    const AUTO_REFRESH_INTERVAL_MS = 15000;

    const intervalId = setInterval(() => {
      // Don't auto-refresh if tab is in the background
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      const state = usePOSStore.getState();
      if (!state.autoRefreshEnabled || state.actionLoading) {
        return;
      }

      silentRefreshCall();
    }, AUTO_REFRESH_INTERVAL_MS);

    // Refresh immediately when returning to the tab if it was hidden
    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && !document.hidden) {
        const state = usePOSStore.getState();
        if (state.autoRefreshEnabled && !state.actionLoading) {
          silentRefreshCall();
        }
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      clearInterval(intervalId);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [silentRefreshCall]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-gray-50/50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm w-full">
      {/* Top Header Navigation */}
      <HeaderComponent props={props} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left / Center View */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === IPosViewMode.table && <TableComponent props={props} />}
          {viewMode === IPosViewMode.order && <MenuComponent props={props} />}
          {viewMode === IPosViewMode.orders_list && <OrderQueueComponent props={props} />}
        </div>

        {/* Right Order Cart Panel (Shown in Order Mode or whenever a table is actively selected) */}
        {viewMode === IPosViewMode.order && (
          <CartComponent props={props} />
        )}
      </div>

      {/* Settlement & Payment Modal */}
      <PaymentComponent props={props} />

      {/* Bill & Receipt Printable Modal */}
      <ReceiptModalComponent props={props} />

      {/* Move / Transfer Table Modal */}
      <MoveTableModalComponent props={props} />
    </div>
  );
};

export default POSList;
