import { gql } from '@apollo/client';

export const LOAD_ORDER = gql`
  query LoadOrder($input: LoadOrderDto) {
    loadOrder(input: $input) {
      order {
        _id
        orderNumber
        tableId
        staffId
        status
        note
        subTotal
        discount
        total
        items {
          _id
          orderId
          menuItemId
          menuItemName
          quantity
          unitPrice
          totalPrice
          note
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOAD_ORDER_BY_TABLE = gql`
  query LoadOrderByTable($input: LoadOrderByTableDto!) {
    loadOrderByTable(input: $input) {
      order {
        _id
        orderNumber
        tableId
        staffId
        status
        note
        subTotal
        discount
        total
        items {
          _id
          orderId
          menuItemId
          menuItemName
          quantity
          unitPrice
          totalPrice
          note
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOAD_ORDER_BY_ID = gql`
  query LoadOrderById($input: LoadOrderByIdDto!) {
    loadOrderById(input: $input) {
      order {
        _id
        orderNumber
        tableId
        staffId
        status
        note
        subTotal
        discount
        total
        items {
          _id
          orderId
          menuItemId
          menuItemName
          quantity
          unitPrice
          totalPrice
          note
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderDto!) {
    createOrder(input: $input) {
      order {
        _id
        orderNumber
        tableId
        staffId
        status
        note
        subTotal
        discount
        total
        items {
          _id
          orderId
          menuItemId
          menuItemName
          quantity
          unitPrice
          totalPrice
          note
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_ORDER_ITEM = gql`
  mutation AddOrderItem($input: AddOrderItemDto!) {
    addOrderItem(input: $input) {
      orderId
      item {
        _id
        orderId
        menuItemId
        menuItemName
        quantity
        unitPrice
        totalPrice
        note
      }
    }
  }
`;

export const REMOVE_ORDER_ITEM = gql`
  mutation RemoveOrderItem($input: RemoveOrderItemDto!) {
    removeOrderItem(input: $input) {
      order {
        _id
        orderNumber
        tableId
        staffId
        status
        subTotal
        discount
        total
        items {
          _id
          orderId
          menuItemId
          menuItemName
          quantity
          unitPrice
          totalPrice
          note
        }
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusDto!) {
    updateOrderStatus(input: $input) {
      order {
        _id
        status
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($input: CancelOrderDto!) {
    cancelOrder(input: $input) {
      _id
    }
  }
`;

export const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($input: ProcessPaymentDto!) {
    processPayment(input: $input) {
      payment {
        _id
        orderId
        currencyId
        method
        amount
        change
        paidAt
        createdAt
      }
    }
  }
`;

export const LOAD_CURRENCIES = gql`
  query LoadCurrencies($input: LoadCurrencyDto) {
    loadCurrencies(input: $input) {
      count
      currency {
        _id
        name
        code
        isActive
      }
    }
  }
`;

export const TRANSFER_TABLE = gql`
  mutation TransferTable($input: TransferTableDto!) {
    transferTable(input: $input) {
      order {
        _id
        orderNumber
        tableId
        status
        total
      }
    }
  }
`;
