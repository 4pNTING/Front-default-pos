import { gql } from "@apollo/client";

export const LOAD_MENU_OPTION_BY_MENU_ITEM = gql`
  query LoadMenuOptionByMenuItem($input: LoadMenuOptionByMenuItemDto!) {
    loadMenuOptionByMenuItem(input: $input) {
      menuOption {
        _id
        menuItemId
        name
        extraPrice
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_MENU_OPTION = gql`
  mutation CreateMenuOption($input: CreateMenuOptionDto!) {
    createMenuOption(input: $input) {
      menuOption {
        _id
        menuItemId
        name
        extraPrice
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_MENU_OPTION = gql`
  mutation UpdateMenuOption($input: UpdateMenuOptionDto!) {
    updateMenuOption(input: $input) {
      menuOption {
        _id
        menuItemId
        name
        extraPrice
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_MENU_OPTION = gql`
  mutation DeleteMenuOption($input: DeleteMenuOptionDto!) {
    deleteMenuOption(input: $input) {
      _id
    }
  }
`;

