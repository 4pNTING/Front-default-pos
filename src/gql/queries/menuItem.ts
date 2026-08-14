import { gql } from '@apollo/client';

export const LOAD_MENU_ITEM = gql`
  query LoadMenuItem($input: LoadMenuItemDto) {
    loadMenuItem(input: $input) {
      count
      menuItem {
        _id
        uniqueId
        uid
        name
        description
        photo
        price
        categoryId
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOAD_MENU_ITEM_BY_ID = gql`
  query LoadMenuItemById($input: LoadMenuItemByIdDto!) {
    loadMenuItemById(input: $input) {
      menuItem {
        _id
        uniqueId
        uid
        name
        description
        photo
        price
        categoryId
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_MENU_ITEM = gql`
  mutation CreateMenuItem($input: CreateMenuItemDto!) {
    createMenuItem(input: $input) {
      menuItem {
        _id
        uniqueId
        uid
        name
        description
        photo
        price
        categoryId
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_MENU_ITEM = gql`
  mutation UpdateMenuItem($input: UpdateMenuItemDto!) {
    updateMenuItem(input: $input) {
      menuItem {
        _id
        uniqueId
        uid
        name
        description
        photo
        price
        categoryId
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_MENU_ITEM = gql`
  mutation DeleteMenuItem($input: DeleteMenuItemDto!) {
    deleteMenuItem(input: $input) {
      menuItem {
        _id
      }
    }
  }
`;
