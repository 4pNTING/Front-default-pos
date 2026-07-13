import { gql } from "@apollo/client";

export const LOAD_CATEGORY = gql`
  query LoadCategory($input: LoadCategoryDto) {
    loadCategory(input: $input) {
      category {
        _id
        createdAt
        updatedAt
        description
        isActive
        name
        photo
      }
    }
  }
`;

export const LOAD_CATEGORY_BY_ID = gql`
  query LoadCategoryById($input: LoadCategoryByIdDto!) {
    loadCategoryById(input: $input) {
      category {
        _id
        createdAt
        updatedAt
        description
        isActive
        name
        photo
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryDto!) {
    createCategory(input: $input) {
      category {
        _id
        description
        isActive
        name
        photo
      }
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryDto!) {
    updateCategory(input: $input) {
      category {
        _id
        description
        isActive
        name
        photo
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: DeleteCategoryDto!) {
    deleteCategory(input: $input) {
      category {
        _id
      }
    }
  }
`;

export const RESTORE_CATEGORY = gql`
  mutation RestoreCategory($input: RestoreCategoryDto!) {
    restoreCategory(input: $input) {
      category {
        _id
        isActive
      }
    }
  }
`;
