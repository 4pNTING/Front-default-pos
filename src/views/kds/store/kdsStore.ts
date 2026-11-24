"use client";

import { create } from "zustand";
import { KdsStoreState, KdsStatusFilter } from "../type/kdsType";
import { OrderType, POSTableType } from "@/views/pos/type/posType";
import { CategoryType } from "@/views/category/type/categoryType";

export const useKdsStore = create<KdsStoreState>((set) => ({
  orders: [],
  tables: [],
  categories: [],
  loading: true,
  isRefetching: false,
  statusFilter: "all_active",
  stationFilter: "all",
  checkedItems: {},
  audioEnabled: true,
  isFullscreen: false,
  showDemo: false,
  lastUpdated: new Date(),

  setStatusFilter: (statusFilter: KdsStatusFilter) => set({ statusFilter }),

  setStationFilter: (stationFilter: string) => set({ stationFilter }),

  setAudioEnabled: (audioEnabled: boolean) => set({ audioEnabled }),

  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),

  setShowDemo: (showDemo: boolean) => set({ showDemo }),

  toggleItemCheck: (orderId: string, itemId: string) => {
    set((state) => {
      const key = `${orderId}_${itemId}`;
      const nextChecked = { ...state.checkedItems };
      if (nextChecked[key]) {
        delete nextChecked[key];
      } else {
        nextChecked[key] = true;
      }
      return { checkedItems: nextChecked };
    });
  },

  setOrders: (orders: OrderType[]) => set({ orders }),

  setTables: (tables: POSTableType[]) => set({ tables }),

  setCategories: (categories: CategoryType[]) => set({ categories }),

  setLoading: (loading: boolean) => set({ loading }),

  setIsRefetching: (isRefetching: boolean) => set({ isRefetching }),

  setLastUpdated: (lastUpdated: Date) => set({ lastUpdated }),
}));
