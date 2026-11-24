import { OrderType, POSTableType } from "@/views/pos/type/posType";
import { CategoryType } from "@/views/category/type/categoryType";

export interface KdsProps {
  dictionary: any;
  lang: string;
}

export type KdsStatusFilter = "all" | "all_active" | "confirmed" | "preparing" | "served";

export interface KdsElapsedInfo {
  text: string;
  minutes: number;
  level: "fresh" | "warning" | "urgent";
}

export interface KdsStoreState {
  orders: OrderType[];
  tables: POSTableType[];
  categories: CategoryType[];
  loading: boolean;
  isRefetching: boolean;
  statusFilter: KdsStatusFilter;
  stationFilter: string;
  checkedItems: Record<string, boolean>;
  audioEnabled: boolean;
  isFullscreen: boolean;
  showDemo: boolean;
  lastUpdated: Date;

  setStatusFilter: (filter: KdsStatusFilter) => void;
  setStationFilter: (station: string) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setShowDemo: (showDemo: boolean) => void;
  toggleItemCheck: (orderId: string, itemId: string) => void;
  setOrders: (orders: OrderType[]) => void;
  setTables: (tables: POSTableType[]) => void;
  setCategories: (categories: CategoryType[]) => void;
  setLoading: (loading: boolean) => void;
  setIsRefetching: (refetching: boolean) => void;
  setLastUpdated: (date: Date) => void;
}
