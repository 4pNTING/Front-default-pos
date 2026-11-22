import { gql } from "@apollo/client";

export const LOAD_INVENTORY = gql`
  query LoadInventory($input: LoadInventoryDto) {
    loadInventory(input: $input) {
      total
      items {
        _id
        name
        sku
        category
        unit
        currentStock
        minStockAlert
        costPerUnit
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOAD_LOW_STOCK_ALERT = gql`
  query LoadLowStockAlert {
    loadLowStockAlert {
      items {
        _id
        name
        sku
        category
        unit
        currentStock
        minStockAlert
        costPerUnit
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOAD_RECIPE_BY_MENU_ITEM = gql`
  query LoadRecipeByMenuItem($menuItemId: String!) {
    loadRecipeByMenuItem(menuItemId: $menuItemId) {
      recipes {
        _id
        menuItemId
        inventoryItemId
        quantityRequired
        inventoryItem {
          _id
          name
          unit
          currentStock
          costPerUnit
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOAD_STOCK_HISTORY = gql`
  query LoadStockHistory($input: LoadStockHistoryDto) {
    loadStockHistory(input: $input) {
      total
      items {
        _id
        inventoryItemId
        type
        quantity
        balanceAfter
        orderId
        staffId
        note
        inventoryItem {
          _id
          name
          unit
        }
        createdAt
      }
    }
  }
`;

export const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($input: CreateInventoryItemDto!) {
    createInventoryItem(input: $input) {
      item {
        _id
        name
        sku
        category
        unit
        currentStock
        minStockAlert
        costPerUnit
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($input: UpdateInventoryItemDto!) {
    updateInventoryItem(input: $input) {
      item {
        _id
        name
        sku
        category
        unit
        minStockAlert
        costPerUnit
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_INVENTORY_ITEM = gql`
  mutation DeleteInventoryItem($input: DeleteInventoryItemDto!) {
    deleteInventoryItem(input: $input) {
      _id
    }
  }
`;

export const ADJUST_STOCK = gql`
  mutation AdjustStock($input: AdjustStockDto!) {
    adjustStock(input: $input) {
      transaction {
        _id
        inventoryItemId
        type
        quantity
        balanceAfter
        orderId
        staffId
        note
        createdAt
      }
      item {
        _id
        name
        currentStock
        updatedAt
      }
    }
  }
`;

export const SET_MENU_ITEM_RECIPE = gql`
  mutation SetMenuItemRecipe($input: SetMenuItemRecipeDto!) {
    setMenuItemRecipe(input: $input) {
      menuItemId
      recipes {
        _id
        menuItemId
        inventoryItemId
        quantityRequired
        inventoryItem {
          _id
          name
          unit
          currentStock
        }
      }
    }
  }
`;
