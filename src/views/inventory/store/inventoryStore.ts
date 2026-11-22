import { create } from "zustand";
import { useMutation } from "@apollo/client";
import { ToastService } from "@/utils/toastService";
import {
  InventoryItemType,
  StockTransactionType,
  RecipeItemType,
  LoadInventoryInput,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  AdjustStockInput,
  SetMenuItemRecipeInput,
} from "../type/inventoryType";
import {
  CREATE_INVENTORY_ITEM,
  UPDATE_INVENTORY_ITEM,
  DELETE_INVENTORY_ITEM,
  ADJUST_STOCK,
  SET_MENU_ITEM_RECIPE,
} from "@/gql/queries/inventory";

export const useInventoryMutations = () => {
  const [createInventoryItemMutation] = useMutation(CREATE_INVENTORY_ITEM);
  const [updateInventoryItemMutation] = useMutation(UPDATE_INVENTORY_ITEM);
  const [deleteInventoryItemMutation] = useMutation(DELETE_INVENTORY_ITEM);
  const [adjustStockMutation] = useMutation(ADJUST_STOCK);
  const [setMenuItemRecipeMutation] = useMutation(SET_MENU_ITEM_RECIPE);

  return {
    createInventoryItemMutation,
    updateInventoryItemMutation,
    deleteInventoryItemMutation,
    adjustStockMutation,
    setMenuItemRecipeMutation,
  };
};

interface InventoryState {
  inventoryList: InventoryItemType[];
  lowStockItems: InventoryItemType[];
  total: number;
  loading: boolean;
  actionLoading: boolean;

  // Selected item for edit, stock adjustment, or history
  selectedItem: InventoryItemType | null;
  setSelectedItem: (item: InventoryItemType | null) => void;

  // Modals state
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;

  isEditModalOpen: boolean;
  setEditModalOpen: (open: boolean, item?: InventoryItemType) => void;

  isAdjustModalOpen: boolean;
  setAdjustModalOpen: (open: boolean, item?: InventoryItemType) => void;

  isHistoryModalOpen: boolean;
  setHistoryModalOpen: (open: boolean, item?: InventoryItemType) => void;

  // Stock history
  stockHistory: StockTransactionType[];
  historyTotal: number;
  historyLoading: boolean;

  // Filters & Search
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;

  pageIndex: number;
  pageSize: number;
  setPagination: (page: number, size: number) => void;

  // API Calls
  loadInventoryAPI: (params: { query: any; input?: LoadInventoryInput }) => Promise<void>;
  loadLowStockAlertAPI: (params: { query: any }) => Promise<void>;
  createInventoryItemAPI: (params: { mutation: any; input: CreateInventoryItemInput }) => Promise<boolean>;
  updateInventoryItemAPI: (params: { mutation: any; input: UpdateInventoryItemInput }) => Promise<boolean>;
  deleteInventoryItemAPI: (params: { mutation: any; _id: string }) => Promise<boolean>;
  adjustStockAPI: (params: { mutation: any; input: AdjustStockInput }) => Promise<boolean>;
  loadStockHistoryAPI: (params: { query: any; input: { inventoryItemId?: string; type?: string; page?: number; limit?: number } }) => Promise<void>;
  loadRecipeByMenuItemAPI: (params: { query: any; menuItemId: string }) => Promise<RecipeItemType[]>;
  setMenuItemRecipeAPI: (params: { mutation: any; input: SetMenuItemRecipeInput }) => Promise<boolean>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventoryList: [],
  lowStockItems: [],
  total: 0,
  loading: false,
  actionLoading: false,

  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),

  isCreateModalOpen: false,
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

  isEditModalOpen: false,
  setEditModalOpen: (open, item) => {
    if (item) {
      set({ isEditModalOpen: open, selectedItem: item });
    } else {
      set({ isEditModalOpen: open });
    }
  },

  isAdjustModalOpen: false,
  setAdjustModalOpen: (open, item) => {
    if (item) {
      set({ isAdjustModalOpen: open, selectedItem: item });
    } else {
      set({ isAdjustModalOpen: open });
    }
  },

  isHistoryModalOpen: false,
  setHistoryModalOpen: (open, item) => {
    if (item) {
      set({ isHistoryModalOpen: open, selectedItem: item });
    } else {
      set({ isHistoryModalOpen: open });
    }
  },

  stockHistory: [],
  historyTotal: 0,
  historyLoading: false,

  selectedCategory: "all",
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  searchKeyword: "",
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  pageIndex: 1,
  pageSize: 20,
  setPagination: (page, size) => set({ pageIndex: page, pageSize: size }),

  // 1. Load Inventory List
  loadInventoryAPI: async ({ query, input }) => {
    try {
      set({ loading: true });
      const currentCategory = get().selectedCategory;
      const currentKeyword = get().searchKeyword;

      let categoryFilter: string | undefined = undefined;
      if (currentCategory && currentCategory !== "all") {
        categoryFilter = currentCategory;
      }

      let searchFilter: string | undefined = undefined;
      if (currentKeyword && currentKeyword.trim() !== "") {
        searchFilter = currentKeyword.trim();
      }

      const mergedInput: LoadInventoryInput = {
        page: get().pageIndex,
        limit: get().pageSize,
        category: categoryFilter,
        search: searchFilter,
        ...input,
      };

      const res = await query({
        variables: { input: mergedInput },
      });

      if (res?.data?.loadInventory) {
        set({
          inventoryList: res.data.loadInventory.items || [],
          total: res.data.loadInventory.total || 0,
        });
      }
    } catch (err: any) {
      ToastService.error(err.message || "Failed to load inventory items");
    } finally {
      set({ loading: false });
    }
  },

  // 2. Load Low Stock Alerts
  loadLowStockAlertAPI: async ({ query }) => {
    try {
      const res = await query();
      if (res?.data?.loadLowStockAlert) {
        set({
          lowStockItems: res.data.loadLowStockAlert.items || [],
        });
      }
    } catch (err: any) {
      console.warn("Failed to load low stock alerts:", err);
    }
  },

  // 3. Create Item
  createInventoryItemAPI: async ({ mutation, input }) => {
    try {
      set({ actionLoading: true });
      const res = await mutation({
        variables: { input },
      });

      if (res?.data?.createInventoryItem?.item) {
        const newItem = res.data.createInventoryItem.item;
        set((state) => ({
          inventoryList: [newItem, ...state.inventoryList],
          total: state.total + 1,
          isCreateModalOpen: false,
        }));
        ToastService.success("ເພີ່ມລາຍການວັດຖຸດິບສຳເລັດ / เพิ่มวัตถุดิบสำเร็จ");
        return true;
      }
      return false;
    } catch (err: any) {
      ToastService.error(err.message || "Failed to create inventory item");
      return false;
    } finally {
      set({ actionLoading: false });
    }
  },

  // 4. Update Item
  updateInventoryItemAPI: async ({ mutation, input }) => {
    try {
      set({ actionLoading: true });
      const res = await mutation({
        variables: { input },
      });

      if (res?.data?.updateInventoryItem?.item) {
        const updated = res.data.updateInventoryItem.item;
        set((state) => ({
          inventoryList: state.inventoryList.map((item) => {
            if (item._id === updated._id) {
              return { ...item, ...updated };
            }
            return item;
          }),
          isEditModalOpen: false,
          selectedItem: null,
        }));
        ToastService.success("ອັບເດດຂໍ້ມູນສຳເລັດ / อัปเดตข้อมูลสำเร็จ");
        return true;
      }
      return false;
    } catch (err: any) {
      ToastService.error(err.message || "Failed to update inventory item");
      return false;
    } finally {
      set({ actionLoading: false });
    }
  },

  // 5. Delete Item
  deleteInventoryItemAPI: async ({ mutation, _id }) => {
    try {
      set({ actionLoading: true });
      const res = await mutation({
        variables: { input: { _id } },
      });

      if (res?.data?.deleteInventoryItem?._id) {
        set((state) => ({
          inventoryList: state.inventoryList.filter((item) => item._id !== _id),
          total: Math.max(0, state.total - 1),
        }));
        ToastService.success("ລົບລາຍການສຳເລັດ / ลบรายการสำเร็จ");
        return true;
      }
      return false;
    } catch (err: any) {
      ToastService.error(err.message || "Failed to delete inventory item");
      return false;
    } finally {
      set({ actionLoading: false });
    }
  },

  // 6. Adjust Stock (IN, WASTE, ADJUSTMENT)
  adjustStockAPI: async ({ mutation, input }) => {
    try {
      set({ actionLoading: true });
      const res = await mutation({
        variables: { input },
      });

      if (res?.data?.adjustStock?.item) {
        const updatedItem = res.data.adjustStock.item;
        set((state) => ({
          inventoryList: state.inventoryList.map((item) => {
            if (item._id === updatedItem._id) {
              return { ...item, currentStock: updatedItem.currentStock, updatedAt: updatedItem.updatedAt };
            }
            return item;
          }),
          isAdjustModalOpen: false,
        }));
        ToastService.success("ປັບຍອດສະຕັອກສຳເລັດ / ปรับยอดสต็อกสำเร็จ");
        return true;
      }
      return false;
    } catch (err: any) {
      ToastService.error(err.message || "Failed to adjust stock");
      return false;
    } finally {
      set({ actionLoading: false });
    }
  },

  // 7. Load Stock Ledger History
  loadStockHistoryAPI: async ({ query, input }) => {
    try {
      set({ historyLoading: true });
      const res = await query({
        variables: { input },
      });

      if (res?.data?.loadStockHistory) {
        set({
          stockHistory: res.data.loadStockHistory.items || [],
          historyTotal: res.data.loadStockHistory.total || 0,
        });
      }
    } catch (err: any) {
      ToastService.error(err.message || "Failed to load stock history");
    } finally {
      set({ historyLoading: false });
    }
  },

  // 8. Load Recipe by MenuItem
  loadRecipeByMenuItemAPI: async ({ query, menuItemId }) => {
    try {
      const res = await query({
        variables: { menuItemId },
      });
      if (res?.data?.loadRecipeByMenuItem?.recipes) {
        return res.data.loadRecipeByMenuItem.recipes;
      }
      return [];
    } catch (err: any) {
      console.warn("Failed to load recipe:", err);
      return [];
    }
  },

  // 9. Save Recipe for MenuItem
  setMenuItemRecipeAPI: async ({ mutation, input }) => {
    try {
      set({ actionLoading: true });
      const res = await mutation({
        variables: { input },
      });
      if (res?.data?.setMenuItemRecipe) {
        ToastService.success("ບັນທຶກສູດອາຫານສຳເລັດ / บันทึกสูตรอาหารสำเร็จ");
        return true;
      }
      return false;
    } catch (err: any) {
      ToastService.error(err.message || "Failed to save recipe");
      return false;
    } finally {
      set({ actionLoading: false });
    }
  },
}));
