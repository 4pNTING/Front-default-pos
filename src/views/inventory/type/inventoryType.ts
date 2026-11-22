import { getDictionary } from "@/utils/getDictionary";

export type InventoryListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

export interface InventoryItemType {
  _id: string;
  name: string;
  sku?: string;
  category: string;
  unit: string;
  currentStock: number;
  minStockAlert: number;
  costPerUnit: number;
  isActive: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockTransactionType {
  _id: string;
  inventoryItemId: string;
  type: string; // 'IN' | 'OUT_SALE' | 'ADJUSTMENT' | 'WASTE'
  quantity: number;
  balanceAfter: number;
  orderId?: string;
  staffId?: string;
  note?: string;
  inventoryItem?: {
    _id: string;
    name: string;
    unit: string;
  };
  createdAt?: string;
}

export interface RecipeItemType {
  _id?: string;
  menuItemId: string;
  inventoryItemId: string;
  quantityRequired: number;
  inventoryItem?: {
    _id: string;
    name: string;
    unit: string;
    currentStock: number;
    costPerUnit?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LoadInventoryInput {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: string;
}

export interface CreateInventoryItemInput {
  name: string;
  sku?: string;
  category: string;
  unit: string;
  currentStock?: number;
  minStockAlert?: number;
  costPerUnit?: number;
  isActive?: string;
}

export interface UpdateInventoryItemInput {
  _id: string;
  name?: string;
  sku?: string;
  category?: string;
  unit?: string;
  minStockAlert?: number;
  costPerUnit?: number;
  isActive?: string;
}

export interface AdjustStockInput {
  inventoryItemId: string;
  type: string;
  quantity: number;
  staffId?: string;
  note?: string;
}

export interface SetMenuItemRecipeInput {
  menuItemId: string;
  ingredients: {
    inventoryItemId: string;
    quantityRequired: number;
  }[];
}
