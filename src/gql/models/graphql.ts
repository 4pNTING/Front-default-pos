/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

/** Filter for active, inactive, or all items */
export enum ActiveStatus {
  Active = 'active',
  All = 'all',
  Inactive = 'inactive'
}

export type AddOrderItemDto = {
  menuItemId: Scalars['String']['input'];
  menuItemName: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type AddOrderItemResponse = {
  __typename?: 'AddOrderItemResponse';
  item?: Maybe<OrderItem>;
  orderId: Scalars['String']['output'];
};

export type AuthLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type AuthLoginResponse = {
  __typename?: 'AuthLoginResponse';
  _id?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type CancelOrderDto = {
  _id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CancelOrderResponse = {
  __typename?: 'CancelOrderResponse';
  _id: Scalars['String']['output'];
};

export type Category = {
  __typename?: 'Category';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
  uniqueId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CreateCategoryDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCategoryResponse = {
  __typename?: 'CreateCategoryResponse';
  category?: Maybe<Category>;
};

export type CreateCurrencyDto = {
  code: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateCurrencyResponse = {
  __typename?: 'CreateCurrencyResponse';
  currency?: Maybe<Currency>;
};

export type CreateCustomerDto = {
  contact?: InputMaybe<CustomerContactInput>;
  district?: InputMaybe<Scalars['String']['input']>;
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  village?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerResponse = {
  __typename?: 'CreateCustomerResponse';
  customer?: Maybe<Customer>;
};

export type CreateMenuItemDto = {
  categoryId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
};

export type CreateMenuItemResponse = {
  __typename?: 'CreateMenuItemResponse';
  menuItem?: Maybe<MenuItem>;
};

export type CreateMenuOptionDto = {
  extraPrice?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  menuItemId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateMenuOptionResponse = {
  __typename?: 'CreateMenuOptionResponse';
  menuOption?: Maybe<MenuOption>;
};

export type CreateOrderDto = {
  discount?: InputMaybe<Scalars['Float']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  staffId: Scalars['String']['input'];
  tableId: Scalars['String']['input'];
};

export type CreateOrderResponse = {
  __typename?: 'CreateOrderResponse';
  order?: Maybe<Order>;
};

export type CreateTableDto = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  number: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  zoneId: Scalars['String']['input'];
};

export type CreateTableResponse = {
  __typename?: 'CreateTableResponse';
  table?: Maybe<Table>;
};

export type CreateZoneDto = {
  isActive?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateZoneResponse = {
  __typename?: 'CreateZoneResponse';
  zone?: Maybe<Zone>;
};

export type Currency = {
  __typename?: 'Currency';
  _id?: Maybe<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid?: Maybe<Scalars['String']['output']>;
  uniqueId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Customer = {
  __typename?: 'Customer';
  _id?: Maybe<Scalars['String']['output']>;
  buId?: Maybe<Scalars['String']['output']>;
  contact?: Maybe<CustomerContactType>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  nationality?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  uid?: Maybe<Scalars['String']['output']>;
  uniqueId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  village?: Maybe<Scalars['String']['output']>;
};

export type CustomerContactInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  village?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerContactType = {
  __typename?: 'CustomerContactType';
  _id?: Maybe<Scalars['String']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  village?: Maybe<Scalars['String']['output']>;
};

export type DeleteCategoryDto = {
  _id: Scalars['String']['input'];
};

export type DeleteCategoryResponse = {
  __typename?: 'DeleteCategoryResponse';
  category?: Maybe<Category>;
};

export type DeleteCurrencyDto = {
  _id: Scalars['String']['input'];
};

export type DeleteCurrencyResponse = {
  __typename?: 'DeleteCurrencyResponse';
  _id: Scalars['String']['output'];
};

export type DeleteCustomerDto = {
  _id: Scalars['String']['input'];
};

export type DeleteCustomerResponse = {
  __typename?: 'DeleteCustomerResponse';
  customer?: Maybe<Customer>;
};

export type DeleteMenuItemDto = {
  _id: Scalars['String']['input'];
};

export type DeleteMenuItemResponse = {
  __typename?: 'DeleteMenuItemResponse';
  menuItem?: Maybe<MenuItem>;
};

export type DeleteMenuOptionDto = {
  _id: Scalars['String']['input'];
};

export type DeleteMenuOptionResponse = {
  __typename?: 'DeleteMenuOptionResponse';
  _id: Scalars['String']['output'];
};

export type DeleteTableDto = {
  _id: Scalars['String']['input'];
};

export type DeleteTableResponse = {
  __typename?: 'DeleteTableResponse';
  table?: Maybe<Table>;
};

export type DeleteZoneDto = {
  _id: Scalars['String']['input'];
};

export type DeleteZoneResponse = {
  __typename?: 'DeleteZoneResponse';
  zone?: Maybe<Zone>;
};

export type LoadCategoryByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadCategoryByIdResponse = {
  __typename?: 'LoadCategoryByIdResponse';
  category?: Maybe<Category>;
};

export type LoadCategoryDto = {
  isActive?: InputMaybe<ActiveStatus>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type LoadCategoryResponse = {
  __typename?: 'LoadCategoryResponse';
  category: Array<Category>;
  count?: Maybe<Scalars['Int']['output']>;
};

export type LoadCurrencyByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadCurrencyByIdResponse = {
  __typename?: 'LoadCurrencyByIdResponse';
  currency?: Maybe<Currency>;
};

export type LoadCurrencyDto = {
  isActive?: InputMaybe<ActiveStatus>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type LoadCurrencyResponse = {
  __typename?: 'LoadCurrencyResponse';
  count?: Maybe<Scalars['Int']['output']>;
  currency: Array<Currency>;
};

export type LoadCustomerByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadCustomerByIdResponse = {
  __typename?: 'LoadCustomerByIdResponse';
  customer?: Maybe<Customer>;
};

export type LoadCustomerDto = {
  isActive?: InputMaybe<ActiveStatus>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type LoadCustomerResponse = {
  __typename?: 'LoadCustomerResponse';
  count?: Maybe<Scalars['Int']['output']>;
  customer: Array<Customer>;
};

export type LoadMenuItemByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadMenuItemByIdResponse = {
  __typename?: 'LoadMenuItemByIdResponse';
  menuItem?: Maybe<MenuItem>;
};

export type LoadMenuItemDto = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<ActiveStatus>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type LoadMenuItemResponse = {
  __typename?: 'LoadMenuItemResponse';
  count?: Maybe<Scalars['Int']['output']>;
  menuItem: Array<MenuItem>;
};

export type LoadMenuOptionByMenuItemDto = {
  menuItemId: Scalars['String']['input'];
};

export type LoadMenuOptionResponse = {
  __typename?: 'LoadMenuOptionResponse';
  menuOption: Array<MenuOption>;
};

export type LoadOrderByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadOrderByIdResponse = {
  __typename?: 'LoadOrderByIdResponse';
  order?: Maybe<Order>;
};

export type LoadOrderByTableDto = {
  tableId: Scalars['String']['input'];
};

export type LoadOrderDto = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tableId?: InputMaybe<Scalars['String']['input']>;
};

export type LoadOrderResponse = {
  __typename?: 'LoadOrderResponse';
  order: Array<Order>;
};

export type LoadPaymentByOrderDto = {
  orderId: Scalars['String']['input'];
};

export type LoadPaymentResponse = {
  __typename?: 'LoadPaymentResponse';
  payment: Array<Payment>;
};

export type LoadTableByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadTableByIdResponse = {
  __typename?: 'LoadTableByIdResponse';
  table?: Maybe<Table>;
};

export type LoadTableDto = {
  isActive?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  zoneId?: InputMaybe<Scalars['String']['input']>;
};

export type LoadTableResponse = {
  __typename?: 'LoadTableResponse';
  count?: Maybe<Scalars['Int']['output']>;
  table: Array<Table>;
};

export type LoadZoneByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadZoneByIdResponse = {
  __typename?: 'LoadZoneByIdResponse';
  zone?: Maybe<Zone>;
};

export type LoadZoneDto = {
  isActive?: InputMaybe<ActiveStatus>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type LoadZoneResponse = {
  __typename?: 'LoadZoneResponse';
  count?: Maybe<Scalars['Int']['output']>;
  zone: Array<Zone>;
};

export type MenuItem = {
  __typename?: 'MenuItem';
  _id?: Maybe<Scalars['String']['output']>;
  categoryId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  uid?: Maybe<Scalars['String']['output']>;
  uniqueId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MenuOption = {
  __typename?: 'MenuOption';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  extraPrice: Scalars['Float']['output'];
  isActive?: Maybe<Scalars['String']['output']>;
  menuItemId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addOrderItem: AddOrderItemResponse;
  cancelOrder: CancelOrderResponse;
  createCategory: CreateCategoryResponse;
  createCurrency: CreateCurrencyResponse;
  createCustomer: CreateCustomerResponse;
  createMenuItem: CreateMenuItemResponse;
  createMenuOption: CreateMenuOptionResponse;
  createOrder: CreateOrderResponse;
  createTable: CreateTableResponse;
  createZone: CreateZoneResponse;
  deleteCategory: DeleteCategoryResponse;
  deleteCurrency: DeleteCurrencyResponse;
  deleteCustomer: DeleteCustomerResponse;
  deleteMenuItem: DeleteMenuItemResponse;
  deleteMenuOption: DeleteMenuOptionResponse;
  deleteTable: DeleteTableResponse;
  deleteZone: DeleteZoneResponse;
  login: AuthLoginResponse;
  processPayment: PaymentResponse;
  removeOrderItem: UpdateOrderResponse;
  restoreCategory: RestoreCategoryResponse;
  restoreCustomer: RestoreCustomerResponse;
  restoreTable: RestoreTableResponse;
  restoreZone: RestoreZoneResponse;
  updateCategory: UpdateCategoryResponse;
  updateCurrency: UpdateCurrencyResponse;
  updateCustomer: UpdateCustomerResponse;
  updateMenuItem: UpdateMenuItemResponse;
  updateMenuOption: UpdateMenuOptionResponse;
  updateOrderStatus: UpdateOrderResponse;
  updateTable: UpdateTableResponse;
  updateZone: UpdateZoneResponse;
};


export type MutationAddOrderItemArgs = {
  input: AddOrderItemDto;
};


export type MutationCancelOrderArgs = {
  input: CancelOrderDto;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryDto;
};


export type MutationCreateCurrencyArgs = {
  input: CreateCurrencyDto;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerDto;
};


export type MutationCreateMenuItemArgs = {
  input: CreateMenuItemDto;
};


export type MutationCreateMenuOptionArgs = {
  input: CreateMenuOptionDto;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderDto;
};


export type MutationCreateTableArgs = {
  input: CreateTableDto;
};


export type MutationCreateZoneArgs = {
  input: CreateZoneDto;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryDto;
};


export type MutationDeleteCurrencyArgs = {
  input: DeleteCurrencyDto;
};


export type MutationDeleteCustomerArgs = {
  input: DeleteCustomerDto;
};


export type MutationDeleteMenuItemArgs = {
  input: DeleteMenuItemDto;
};


export type MutationDeleteMenuOptionArgs = {
  input: DeleteMenuOptionDto;
};


export type MutationDeleteTableArgs = {
  input: DeleteTableDto;
};


export type MutationDeleteZoneArgs = {
  input: DeleteZoneDto;
};


export type MutationLoginArgs = {
  loginData: AuthLoginArgs;
};


export type MutationProcessPaymentArgs = {
  input: ProcessPaymentDto;
};


export type MutationRemoveOrderItemArgs = {
  input: RemoveOrderItemDto;
};


export type MutationRestoreCategoryArgs = {
  input: RestoreCategoryDto;
};


export type MutationRestoreCustomerArgs = {
  input: RestoreCustomerDto;
};


export type MutationRestoreTableArgs = {
  input: RestoreTableDto;
};


export type MutationRestoreZoneArgs = {
  input: RestoreZoneDto;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryDto;
};


export type MutationUpdateCurrencyArgs = {
  input: UpdateCurrencyDto;
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerDto;
};


export type MutationUpdateMenuItemArgs = {
  input: UpdateMenuItemDto;
};


export type MutationUpdateMenuOptionArgs = {
  input: UpdateMenuOptionDto;
};


export type MutationUpdateOrderStatusArgs = {
  input: UpdateOrderStatusDto;
};


export type MutationUpdateTableArgs = {
  input: UpdateTableDto;
};


export type MutationUpdateZoneArgs = {
  input: UpdateZoneDto;
};

export type Order = {
  __typename?: 'Order';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discount: Scalars['Float']['output'];
  items?: Maybe<Array<OrderItem>>;
  note?: Maybe<Scalars['String']['output']>;
  orderNumber: Scalars['String']['output'];
  staffId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  subTotal: Scalars['Float']['output'];
  tableId: Scalars['String']['output'];
  total: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  _id?: Maybe<Scalars['String']['output']>;
  menuItemId: Scalars['String']['output'];
  menuItemName: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  orderId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  totalPrice: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type Payment = {
  __typename?: 'Payment';
  _id?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Float']['output'];
  change: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currencyId: Scalars['String']['output'];
  method: Scalars['String']['output'];
  orderId: Scalars['String']['output'];
  paidAt: Scalars['DateTime']['output'];
};

export type PaymentResponse = {
  __typename?: 'PaymentResponse';
  payment?: Maybe<Payment>;
};

export type ProcessPaymentDto = {
  amount: Scalars['Float']['input'];
  currencyId: Scalars['String']['input'];
  method: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  loadCategory: LoadCategoryResponse;
  loadCategoryById?: Maybe<LoadCategoryByIdResponse>;
  loadCurrencies: LoadCurrencyResponse;
  loadCurrencyById: LoadCurrencyByIdResponse;
  loadCustomer: LoadCustomerResponse;
  loadCustomerById?: Maybe<LoadCustomerByIdResponse>;
  loadMenuItem: LoadMenuItemResponse;
  loadMenuItemById?: Maybe<LoadMenuItemByIdResponse>;
  loadMenuOptionByMenuItem: LoadMenuOptionResponse;
  loadOrder: LoadOrderResponse;
  loadOrderById?: Maybe<LoadOrderByIdResponse>;
  loadOrderByTable: LoadOrderResponse;
  loadPaymentByOrder: LoadPaymentResponse;
  loadTable: LoadTableResponse;
  loadTableById?: Maybe<LoadTableByIdResponse>;
  loadZone: LoadZoneResponse;
  loadZoneById: LoadZoneByIdResponse;
};


export type QueryLoadCategoryArgs = {
  input?: InputMaybe<LoadCategoryDto>;
};


export type QueryLoadCategoryByIdArgs = {
  input: LoadCategoryByIdDto;
};


export type QueryLoadCurrenciesArgs = {
  input?: InputMaybe<LoadCurrencyDto>;
};


export type QueryLoadCurrencyByIdArgs = {
  input: LoadCurrencyByIdDto;
};


export type QueryLoadCustomerArgs = {
  input?: InputMaybe<LoadCustomerDto>;
};


export type QueryLoadCustomerByIdArgs = {
  input: LoadCustomerByIdDto;
};


export type QueryLoadMenuItemArgs = {
  input?: InputMaybe<LoadMenuItemDto>;
};


export type QueryLoadMenuItemByIdArgs = {
  input: LoadMenuItemByIdDto;
};


export type QueryLoadMenuOptionByMenuItemArgs = {
  input: LoadMenuOptionByMenuItemDto;
};


export type QueryLoadOrderArgs = {
  input?: InputMaybe<LoadOrderDto>;
};


export type QueryLoadOrderByIdArgs = {
  input: LoadOrderByIdDto;
};


export type QueryLoadOrderByTableArgs = {
  input: LoadOrderByTableDto;
};


export type QueryLoadPaymentByOrderArgs = {
  input: LoadPaymentByOrderDto;
};


export type QueryLoadTableArgs = {
  input?: InputMaybe<LoadTableDto>;
};


export type QueryLoadTableByIdArgs = {
  input: LoadTableByIdDto;
};


export type QueryLoadZoneArgs = {
  input?: InputMaybe<LoadZoneDto>;
};


export type QueryLoadZoneByIdArgs = {
  input: LoadZoneByIdDto;
};

export type RemoveOrderItemDto = {
  orderId: Scalars['String']['input'];
  orderItemId: Scalars['String']['input'];
};

export type RestoreCategoryDto = {
  _id: Scalars['String']['input'];
};

export type RestoreCategoryResponse = {
  __typename?: 'RestoreCategoryResponse';
  category?: Maybe<Category>;
};

export type RestoreCustomerDto = {
  _id: Scalars['String']['input'];
};

export type RestoreCustomerResponse = {
  __typename?: 'RestoreCustomerResponse';
  customer?: Maybe<Customer>;
};

export type RestoreTableDto = {
  _id: Scalars['String']['input'];
};

export type RestoreTableResponse = {
  __typename?: 'RestoreTableResponse';
  table?: Maybe<Table>;
};

export type RestoreZoneDto = {
  _id: Scalars['String']['input'];
};

export type RestoreZoneResponse = {
  __typename?: 'RestoreZoneResponse';
  zone?: Maybe<Zone>;
};

export type Table = {
  __typename?: 'Table';
  _id?: Maybe<Scalars['String']['output']>;
  capacity: Scalars['Int']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  number: Scalars['String']['output'];
  status: Scalars['String']['output'];
  uid?: Maybe<Scalars['String']['output']>;
  uniqueId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  zoneId: Scalars['String']['output'];
};

export type UpdateCategoryDto = {
  _id: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryResponse = {
  __typename?: 'UpdateCategoryResponse';
  category?: Maybe<Category>;
};

export type UpdateCurrencyDto = {
  _id: Scalars['String']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<ActiveStatus>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCurrencyResponse = {
  __typename?: 'UpdateCurrencyResponse';
  currency?: Maybe<Currency>;
};

export type UpdateCustomerDto = {
  _id: Scalars['String']['input'];
  contact?: InputMaybe<CustomerContactInput>;
  district?: InputMaybe<Scalars['String']['input']>;
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  village?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerResponse = {
  __typename?: 'UpdateCustomerResponse';
  customer?: Maybe<Customer>;
};

export type UpdateMenuItemDto = {
  _id: Scalars['String']['input'];
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateMenuItemResponse = {
  __typename?: 'UpdateMenuItemResponse';
  menuItem?: Maybe<MenuItem>;
};

export type UpdateMenuOptionDto = {
  _id: Scalars['String']['input'];
  extraPrice?: InputMaybe<Scalars['Float']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMenuOptionResponse = {
  __typename?: 'UpdateMenuOptionResponse';
  menuOption?: Maybe<MenuOption>;
};

export type UpdateOrderResponse = {
  __typename?: 'UpdateOrderResponse';
  order?: Maybe<Order>;
};

export type UpdateOrderStatusDto = {
  _id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type UpdateTableDto = {
  _id: Scalars['String']['input'];
  capacity?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  zoneId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTableResponse = {
  __typename?: 'UpdateTableResponse';
  table?: Maybe<Table>;
};

export type UpdateZoneDto = {
  _id: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateZoneResponse = {
  __typename?: 'UpdateZoneResponse';
  zone?: Maybe<Zone>;
};

export type Zone = {
  __typename?: 'Zone';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  uid?: Maybe<Scalars['String']['output']>;
  uniqueId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LoginMutationVariables = Exact<{
  input: AuthLoginArgs;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthLoginResponse', _id?: string | null, username?: string | null, role?: string | null, isActive?: string | null, token?: string | null, refreshToken?: string | null } };

export type LoadCategoryQueryVariables = Exact<{
  input?: InputMaybe<LoadCategoryDto>;
}>;


export type LoadCategoryQuery = { __typename?: 'Query', loadCategory: { __typename?: 'LoadCategoryResponse', category: Array<{ __typename?: 'Category', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, description?: string | null, isActive?: string | null, name: string, photo?: string | null }> } };

export type LoadCategoryByIdQueryVariables = Exact<{
  input: LoadCategoryByIdDto;
}>;


export type LoadCategoryByIdQuery = { __typename?: 'Query', loadCategoryById?: { __typename?: 'LoadCategoryByIdResponse', category?: { __typename?: 'Category', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, description?: string | null, isActive?: string | null, name: string, photo?: string | null } | null } | null };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryDto;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CreateCategoryResponse', category?: { __typename?: 'Category', _id?: string | null, description?: string | null, isActive?: string | null, name: string, photo?: string | null } | null } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryDto;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'UpdateCategoryResponse', category?: { __typename?: 'Category', _id?: string | null, description?: string | null, isActive?: string | null, name: string, photo?: string | null } | null } };

export type DeleteCategoryMutationVariables = Exact<{
  input: DeleteCategoryDto;
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'DeleteCategoryResponse', category?: { __typename?: 'Category', _id?: string | null } | null } };

export type RestoreCategoryMutationVariables = Exact<{
  input: RestoreCategoryDto;
}>;


export type RestoreCategoryMutation = { __typename?: 'Mutation', restoreCategory: { __typename?: 'RestoreCategoryResponse', category?: { __typename?: 'Category', _id?: string | null, isActive?: string | null } | null } };

export type LoadCustomerQueryVariables = Exact<{
  input?: InputMaybe<LoadCustomerDto>;
}>;


export type LoadCustomerQuery = { __typename?: 'Query', loadCustomer: { __typename?: 'LoadCustomerResponse', count?: number | null, customer: Array<{ __typename?: 'Customer', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, gender?: string | null, nationality?: string | null, province?: string | null, district?: string | null, village?: string | null, fileUrl?: string | null, isActive?: string | null, createdAt?: any | null, updatedAt?: any | null, createdBy?: string | null, updatedBy?: string | null, contact?: { __typename?: 'CustomerContactType', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, province?: string | null, district?: string | null, village?: string | null } | null }> } };

export type LoadCustomerByIdQueryVariables = Exact<{
  input: LoadCustomerByIdDto;
}>;


export type LoadCustomerByIdQuery = { __typename?: 'Query', loadCustomerById?: { __typename?: 'LoadCustomerByIdResponse', customer?: { __typename?: 'Customer', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, gender?: string | null, nationality?: string | null, province?: string | null, district?: string | null, village?: string | null, fileUrl?: string | null, isActive?: string | null, contact?: { __typename?: 'CustomerContactType', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, province?: string | null, district?: string | null, village?: string | null } | null } | null } | null };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerDto;
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer: { __typename?: 'CreateCustomerResponse', customer?: { __typename?: 'Customer', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, gender?: string | null, nationality?: string | null, province?: string | null, district?: string | null, village?: string | null, fileUrl?: string | null, isActive?: string | null, contact?: { __typename?: 'CustomerContactType', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, province?: string | null, district?: string | null, village?: string | null } | null } | null } };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerDto;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer: { __typename?: 'UpdateCustomerResponse', customer?: { __typename?: 'Customer', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, gender?: string | null, nationality?: string | null, province?: string | null, district?: string | null, village?: string | null, fileUrl?: string | null, isActive?: string | null, contact?: { __typename?: 'CustomerContactType', _id?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, province?: string | null, district?: string | null, village?: string | null } | null } | null } };

export type DeleteCustomerMutationVariables = Exact<{
  input: DeleteCustomerDto;
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', deleteCustomer: { __typename?: 'DeleteCustomerResponse', customer?: { __typename?: 'Customer', _id?: string | null } | null } };

export type RestoreCustomerMutationVariables = Exact<{
  input: RestoreCustomerDto;
}>;


export type RestoreCustomerMutation = { __typename?: 'Mutation', restoreCustomer: { __typename?: 'RestoreCustomerResponse', customer?: { __typename?: 'Customer', _id?: string | null, isActive?: string | null } | null } };

export type LoadZoneQueryVariables = Exact<{
  input: LoadZoneDto;
}>;


export type LoadZoneQuery = { __typename?: 'Query', loadZone: { __typename?: 'LoadZoneResponse', count?: number | null, zone: Array<{ __typename?: 'Zone', _id?: string | null, name: string, isActive?: string | null, createdAt?: any | null, updatedAt?: any | null }> } };

export type CreateZoneMutationVariables = Exact<{
  input: CreateZoneDto;
}>;


export type CreateZoneMutation = { __typename?: 'Mutation', createZone: { __typename?: 'CreateZoneResponse', zone?: { __typename?: 'Zone', _id?: string | null, name: string, isActive?: string | null, createdAt?: any | null, updatedAt?: any | null } | null } };

export type UpdateZoneMutationVariables = Exact<{
  input: UpdateZoneDto;
}>;


export type UpdateZoneMutation = { __typename?: 'Mutation', updateZone: { __typename?: 'UpdateZoneResponse', zone?: { __typename?: 'Zone', _id?: string | null, name: string, isActive?: string | null, createdAt?: any | null, updatedAt?: any | null } | null } };

export type DeleteZoneMutationVariables = Exact<{
  input: DeleteZoneDto;
}>;


export type DeleteZoneMutation = { __typename?: 'Mutation', deleteZone: { __typename?: 'DeleteZoneResponse', zone?: { __typename?: 'Zone', _id?: string | null } | null } };

export type RestoreZoneMutationVariables = Exact<{
  input: RestoreZoneDto;
}>;


export type RestoreZoneMutation = { __typename?: 'Mutation', restoreZone: { __typename?: 'RestoreZoneResponse', zone?: { __typename?: 'Zone', _id?: string | null, name: string, isActive?: string | null } | null } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthLoginArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LoadCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadCategoryDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<LoadCategoryQuery, LoadCategoryQueryVariables>;
export const LoadCategoryByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadCategoryById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadCategoryByIdDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<LoadCategoryByIdQuery, LoadCategoryByIdQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const RestoreCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RestoreCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<RestoreCategoryMutation, RestoreCategoryMutationVariables>;
export const LoadCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadCustomerDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoadCustomerQuery, LoadCustomerQueryVariables>;
export const LoadCustomerByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadCustomerById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadCustomerByIdDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadCustomerById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoadCustomerByIdQuery, LoadCustomerByIdQueryVariables>;
export const CreateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"village"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCustomerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const RestoreCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RestoreCustomerDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<RestoreCustomerMutation, RestoreCustomerMutationVariables>;
export const LoadZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"loadZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LoadZoneQuery, LoadZoneQueryVariables>;
export const CreateZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateZoneMutation, CreateZoneMutationVariables>;
export const UpdateZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateZoneMutation, UpdateZoneMutationVariables>;
export const DeleteZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteZoneMutation, DeleteZoneMutationVariables>;
export const RestoreZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"restoreZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RestoreZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<RestoreZoneMutation, RestoreZoneMutationVariables>;