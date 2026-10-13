import { gql } from '@apollo/client';

export const LOAD_TABLE = gql`
  query LoadTable($input: LoadTableDto) {
    loadTable(input: $input) {
      count
      table {
        _id
        uniqueId
        uid
        number
        zoneId
        capacity
        status
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOAD_TABLE_BY_ID = gql`
  query LoadTableById($input: LoadTableByIdDto!) {
    loadTableById(input: $input) {
      table {
        _id
        uniqueId
        uid
        number
        zoneId
        capacity
        status
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_TABLE = gql`
  mutation CreateTable($input: CreateTableDto!) {
    createTable(input: $input) {
      table {
        _id
        uniqueId
        uid
        number
        zoneId
        capacity
        status
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_TABLE = gql`
  mutation UpdateTable($input: UpdateTableDto!) {
    updateTable(input: $input) {
      table {
        _id
        uniqueId
        uid
        number
        zoneId
        capacity
        status
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_TABLE = gql`
  mutation DeleteTable($input: DeleteTableDto!) {
    deleteTable(input: $input) {
      table {
        _id
      }
    }
  }
`;

export const RESTORE_TABLE = gql`
  mutation RestoreTable($input: RestoreTableDto!) {
    restoreTable(input: $input) {
      table {
        _id
      }
    }
  }
`;
