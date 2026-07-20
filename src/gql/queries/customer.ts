import { gql } from '@apollo/client';

export const LOAD_CUSTOMER = gql`
  query LoadCustomer($input: LoadCustomerDto) {
    loadCustomer(input: $input) {
      count
      customer {
        _id
        firstName
        lastName
        phoneNumber
        gender
        nationality
        province
        district
        village
        fileUrl
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
        contact {
          _id
          firstName
          lastName
          phoneNumber
          province
          district
          village
        }
      }
    }
  }
`;

export const LOAD_CUSTOMER_BY_ID = gql`
  query LoadCustomerById($input: LoadCustomerByIdDto!) {
    loadCustomerById(input: $input) {
      customer {
        _id
        firstName
        lastName
        phoneNumber
        gender
        nationality
        province
        district
        village
        fileUrl
        isActive
        contact {
          _id
          firstName
          lastName
          phoneNumber
          province
          district
          village
        }
      }
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerDto!) {
    createCustomer(input: $input) {
      customer {
        _id
        firstName
        lastName
        phoneNumber
        gender
        nationality
        province
        district
        village
        fileUrl
        isActive
        contact {
          _id
          firstName
          lastName
          phoneNumber
          province
          district
          village
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerDto!) {
    updateCustomer(input: $input) {
      customer {
        _id
        firstName
        lastName
        phoneNumber
        gender
        nationality
        province
        district
        village
        fileUrl
        isActive
        contact {
          _id
          firstName
          lastName
          phoneNumber
          province
          district
          village
        }
      }
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($input: DeleteCustomerDto!) {
    deleteCustomer(input: $input) {
      customer {
        _id
      }
    }
  }
`;

export const RESTORE_DELETE_CUSTOMER = gql`
  mutation RestoreCustomer($input: RestoreCustomerDto!) {
    restoreCustomer(input: $input) {
      customer {
        _id
        isActive
      }
    }
  }
`;
