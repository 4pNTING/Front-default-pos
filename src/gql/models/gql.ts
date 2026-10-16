/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query LoadAttachment($input: LoadAttachmentDto) {\n    loadAttachment(input: $input) {\n      count\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n": types.LoadAttachmentDocument,
    "\n  query LoadAttachmentById($input: LoadAttachmentByIdDto!) {\n    loadAttachmentById(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n": types.LoadAttachmentByIdDocument,
    "\n  mutation CreateAttachment($input: CreateAttachmentDto!) {\n    createAttachment(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n": types.CreateAttachmentDocument,
    "\n  mutation UpdateAttachment($input: UpdateAttachmentDto!) {\n    updateAttachment(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n": types.UpdateAttachmentDocument,
    "\n  mutation DeleteAttachment($input: DeleteAttachmentDto!) {\n    deleteAttachment(input: $input) {\n      attachment {\n        _id\n      }\n    }\n  }\n": types.DeleteAttachmentDocument,
    "\n  mutation RestoreAttachment($input: RestoreAttachmentDto!) {\n    restoreAttachment(input: $input) {\n      attachment {\n        _id\n        isActive\n      }\n    }\n  }\n": types.RestoreAttachmentDocument,
    "\n  mutation Login($input: AuthLoginArgs!) {\n    login(loginData: $input) {\n      _id\n      username\n      role\n      isActive\n      token\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "\n  query LoadCategory($input: LoadCategoryDto) {\n    loadCategory(input: $input) {\n      count\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadCategoryDocument,
    "\n  query LoadCategoryById($input: LoadCategoryByIdDto!) {\n    loadCategoryById(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadCategoryByIdDocument,
    "\n  mutation CreateCategory($input: CreateCategoryDto!) {\n    createCategory(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryDto!) {\n    updateCategory(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($input: DeleteCategoryDto!) {\n    deleteCategory(input: $input) {\n      category {\n        _id\n      }\n    }\n  }\n": types.DeleteCategoryDocument,
    "\n  mutation RestoreCategory($input: RestoreCategoryDto!) {\n    restoreCategory(input: $input) {\n      category {\n        _id\n        isActive\n      }\n    }\n  }\n": types.RestoreCategoryDocument,
    "\n  query LoadCustomer($input: LoadCustomerDto) {\n    loadCustomer(input: $input) {\n      count\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n": types.LoadCustomerDocument,
    "\n  query LoadCustomerById($input: LoadCustomerByIdDto!) {\n    loadCustomerById(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n": types.LoadCustomerByIdDocument,
    "\n  mutation CreateCustomer($input: CreateCustomerDto!) {\n    createCustomer(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n": types.CreateCustomerDocument,
    "\n  mutation UpdateCustomer($input: UpdateCustomerDto!) {\n    updateCustomer(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n": types.UpdateCustomerDocument,
    "\n  mutation DeleteCustomer($input: DeleteCustomerDto!) {\n    deleteCustomer(input: $input) {\n      customer {\n        _id\n      }\n    }\n  }\n": types.DeleteCustomerDocument,
    "\n  mutation RestoreCustomer($input: RestoreCustomerDto!) {\n    restoreCustomer(input: $input) {\n      customer {\n        _id\n        isActive\n      }\n    }\n  }\n": types.RestoreCustomerDocument,
    "\n  query LoadMenuItem($input: LoadMenuItemDto) {\n    loadMenuItem(input: $input) {\n      count\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadMenuItemDocument,
    "\n  query LoadMenuItemById($input: LoadMenuItemByIdDto!) {\n    loadMenuItemById(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadMenuItemByIdDocument,
    "\n  mutation CreateMenuItem($input: CreateMenuItemDto!) {\n    createMenuItem(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.CreateMenuItemDocument,
    "\n  mutation UpdateMenuItem($input: UpdateMenuItemDto!) {\n    updateMenuItem(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.UpdateMenuItemDocument,
    "\n  mutation DeleteMenuItem($input: DeleteMenuItemDto!) {\n    deleteMenuItem(input: $input) {\n      menuItem {\n        _id\n      }\n    }\n  }\n": types.DeleteMenuItemDocument,
    "\n  mutation RestoreMenuItem($input: RestoreMenuItemDto!) {\n    restoreMenuItem(input: $input) {\n      menuItem {\n        _id\n      }\n    }\n  }\n": types.RestoreMenuItemDocument,
    "\n  query LoadOrder($input: LoadOrderDto) {\n    loadOrder(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadOrderDocument,
    "\n  query LoadOrderByTable($input: LoadOrderByTableDto!) {\n    loadOrderByTable(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadOrderByTableDocument,
    "\n  query LoadOrderById($input: LoadOrderByIdDto!) {\n    loadOrderById(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadOrderByIdDocument,
    "\n  mutation CreateOrder($input: CreateOrderDto!) {\n    createOrder(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.CreateOrderDocument,
    "\n  mutation AddOrderItem($input: AddOrderItemDto!) {\n    addOrderItem(input: $input) {\n      orderId\n      item {\n        _id\n        orderId\n        menuItemId\n        menuItemName\n        quantity\n        unitPrice\n        totalPrice\n        note\n      }\n    }\n  }\n": types.AddOrderItemDocument,
    "\n  mutation RemoveOrderItem($input: RemoveOrderItemDto!) {\n    removeOrderItem(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n      }\n    }\n  }\n": types.RemoveOrderItemDocument,
    "\n  mutation UpdateOrderStatus($input: UpdateOrderStatusDto!) {\n    updateOrderStatus(input: $input) {\n      order {\n        _id\n        status\n      }\n    }\n  }\n": types.UpdateOrderStatusDocument,
    "\n  mutation CancelOrder($input: CancelOrderDto!) {\n    cancelOrder(input: $input) {\n      _id\n    }\n  }\n": types.CancelOrderDocument,
    "\n  mutation ProcessPayment($input: ProcessPaymentDto!) {\n    processPayment(input: $input) {\n      payment {\n        _id\n        orderId\n        currencyId\n        method\n        amount\n        change\n        paidAt\n        createdAt\n      }\n    }\n  }\n": types.ProcessPaymentDocument,
    "\n  query LoadCurrencies($input: LoadCurrencyDto) {\n    loadCurrencies(input: $input) {\n      count\n      currency {\n        _id\n        name\n        code\n        isActive\n      }\n    }\n  }\n": types.LoadCurrenciesDocument,
    "\n  mutation TransferTable($input: TransferTableDto!) {\n    transferTable(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        status\n        total\n      }\n    }\n  }\n": types.TransferTableDocument,
    "\n  query LoadTable($input: LoadTableDto) {\n    loadTable(input: $input) {\n      count\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadTableDocument,
    "\n  query LoadTableById($input: LoadTableByIdDto!) {\n    loadTableById(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadTableByIdDocument,
    "\n  mutation CreateTable($input: CreateTableDto!) {\n    createTable(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.CreateTableDocument,
    "\n  mutation UpdateTable($input: UpdateTableDto!) {\n    updateTable(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.UpdateTableDocument,
    "\n  mutation DeleteTable($input: DeleteTableDto!) {\n    deleteTable(input: $input) {\n      table {\n        _id\n      }\n    }\n  }\n": types.DeleteTableDocument,
    "\n  mutation RestoreTable($input: RestoreTableDto!) {\n    restoreTable(input: $input) {\n      table {\n        _id\n      }\n    }\n  }\n": types.RestoreTableDocument,
    "\n  query loadZone($input: LoadZoneDto!) {\n    loadZone(input: $input) {\n      count\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.LoadZoneDocument,
    "\n  mutation createZone($input: CreateZoneDto!) {\n    createZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.CreateZoneDocument,
    "\n  mutation updateZone($input: UpdateZoneDto!) {\n    updateZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.UpdateZoneDocument,
    "\n  mutation deleteZone($input: DeleteZoneDto!) {\n    deleteZone(input: $input) {\n      zone {\n        _id\n      }\n    }\n  }\n": types.DeleteZoneDocument,
    "\n  mutation restoreZone($input: RestoreZoneDto!) {\n    restoreZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n      }\n    }\n  }\n": types.RestoreZoneDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadAttachment($input: LoadAttachmentDto) {\n    loadAttachment(input: $input) {\n      count\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadAttachment($input: LoadAttachmentDto) {\n    loadAttachment(input: $input) {\n      count\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadAttachmentById($input: LoadAttachmentByIdDto!) {\n    loadAttachmentById(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadAttachmentById($input: LoadAttachmentByIdDto!) {\n    loadAttachmentById(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateAttachment($input: CreateAttachmentDto!) {\n    createAttachment(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAttachment($input: CreateAttachmentDto!) {\n    createAttachment(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateAttachment($input: UpdateAttachmentDto!) {\n    updateAttachment(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateAttachment($input: UpdateAttachmentDto!) {\n    updateAttachment(input: $input) {\n      attachment {\n        _id\n        uniqueId\n        uid\n        ownerId\n        ownerType\n        originalName\n        fileName\n        fileUrl\n        filePath\n        fileSize\n        mimeType\n        uploadType\n        status\n        errorMessage\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteAttachment($input: DeleteAttachmentDto!) {\n    deleteAttachment(input: $input) {\n      attachment {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteAttachment($input: DeleteAttachmentDto!) {\n    deleteAttachment(input: $input) {\n      attachment {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RestoreAttachment($input: RestoreAttachmentDto!) {\n    restoreAttachment(input: $input) {\n      attachment {\n        _id\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RestoreAttachment($input: RestoreAttachmentDto!) {\n    restoreAttachment(input: $input) {\n      attachment {\n        _id\n        isActive\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($input: AuthLoginArgs!) {\n    login(loginData: $input) {\n      _id\n      username\n      role\n      isActive\n      token\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: AuthLoginArgs!) {\n    login(loginData: $input) {\n      _id\n      username\n      role\n      isActive\n      token\n      refreshToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadCategory($input: LoadCategoryDto) {\n    loadCategory(input: $input) {\n      count\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadCategory($input: LoadCategoryDto) {\n    loadCategory(input: $input) {\n      count\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadCategoryById($input: LoadCategoryByIdDto!) {\n    loadCategoryById(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadCategoryById($input: LoadCategoryByIdDto!) {\n    loadCategoryById(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateCategory($input: CreateCategoryDto!) {\n    createCategory(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($input: CreateCategoryDto!) {\n    createCategory(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateCategory($input: UpdateCategoryDto!) {\n    updateCategory(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($input: UpdateCategoryDto!) {\n    updateCategory(input: $input) {\n      category {\n        _id\n        name\n        description\n        photo\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteCategory($input: DeleteCategoryDto!) {\n    deleteCategory(input: $input) {\n      category {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($input: DeleteCategoryDto!) {\n    deleteCategory(input: $input) {\n      category {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RestoreCategory($input: RestoreCategoryDto!) {\n    restoreCategory(input: $input) {\n      category {\n        _id\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RestoreCategory($input: RestoreCategoryDto!) {\n    restoreCategory(input: $input) {\n      category {\n        _id\n        isActive\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadCustomer($input: LoadCustomerDto) {\n    loadCustomer(input: $input) {\n      count\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadCustomer($input: LoadCustomerDto) {\n    loadCustomer(input: $input) {\n      count\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        createdAt\n        updatedAt\n        createdBy\n        updatedBy\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadCustomerById($input: LoadCustomerByIdDto!) {\n    loadCustomerById(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadCustomerById($input: LoadCustomerByIdDto!) {\n    loadCustomerById(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateCustomer($input: CreateCustomerDto!) {\n    createCustomer(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCustomer($input: CreateCustomerDto!) {\n    createCustomer(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateCustomer($input: UpdateCustomerDto!) {\n    updateCustomer(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCustomer($input: UpdateCustomerDto!) {\n    updateCustomer(input: $input) {\n      customer {\n        _id\n        firstName\n        lastName\n        phoneNumber\n        gender\n        nationality\n        province\n        district\n        village\n        fileUrl\n        isActive\n        contact {\n          _id\n          firstName\n          lastName\n          phoneNumber\n          province\n          district\n          village\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteCustomer($input: DeleteCustomerDto!) {\n    deleteCustomer(input: $input) {\n      customer {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCustomer($input: DeleteCustomerDto!) {\n    deleteCustomer(input: $input) {\n      customer {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RestoreCustomer($input: RestoreCustomerDto!) {\n    restoreCustomer(input: $input) {\n      customer {\n        _id\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RestoreCustomer($input: RestoreCustomerDto!) {\n    restoreCustomer(input: $input) {\n      customer {\n        _id\n        isActive\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadMenuItem($input: LoadMenuItemDto) {\n    loadMenuItem(input: $input) {\n      count\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadMenuItem($input: LoadMenuItemDto) {\n    loadMenuItem(input: $input) {\n      count\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadMenuItemById($input: LoadMenuItemByIdDto!) {\n    loadMenuItemById(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadMenuItemById($input: LoadMenuItemByIdDto!) {\n    loadMenuItemById(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateMenuItem($input: CreateMenuItemDto!) {\n    createMenuItem(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMenuItem($input: CreateMenuItemDto!) {\n    createMenuItem(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateMenuItem($input: UpdateMenuItemDto!) {\n    updateMenuItem(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMenuItem($input: UpdateMenuItemDto!) {\n    updateMenuItem(input: $input) {\n      menuItem {\n        _id\n        uniqueId\n        uid\n        name\n        description\n        photo\n        price\n        categoryId\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteMenuItem($input: DeleteMenuItemDto!) {\n    deleteMenuItem(input: $input) {\n      menuItem {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteMenuItem($input: DeleteMenuItemDto!) {\n    deleteMenuItem(input: $input) {\n      menuItem {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RestoreMenuItem($input: RestoreMenuItemDto!) {\n    restoreMenuItem(input: $input) {\n      menuItem {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RestoreMenuItem($input: RestoreMenuItemDto!) {\n    restoreMenuItem(input: $input) {\n      menuItem {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadOrder($input: LoadOrderDto) {\n    loadOrder(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadOrder($input: LoadOrderDto) {\n    loadOrder(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadOrderByTable($input: LoadOrderByTableDto!) {\n    loadOrderByTable(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadOrderByTable($input: LoadOrderByTableDto!) {\n    loadOrderByTable(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadOrderById($input: LoadOrderByIdDto!) {\n    loadOrderById(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadOrderById($input: LoadOrderByIdDto!) {\n    loadOrderById(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateOrder($input: CreateOrderDto!) {\n    createOrder(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOrder($input: CreateOrderDto!) {\n    createOrder(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        note\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddOrderItem($input: AddOrderItemDto!) {\n    addOrderItem(input: $input) {\n      orderId\n      item {\n        _id\n        orderId\n        menuItemId\n        menuItemName\n        quantity\n        unitPrice\n        totalPrice\n        note\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddOrderItem($input: AddOrderItemDto!) {\n    addOrderItem(input: $input) {\n      orderId\n      item {\n        _id\n        orderId\n        menuItemId\n        menuItemName\n        quantity\n        unitPrice\n        totalPrice\n        note\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveOrderItem($input: RemoveOrderItemDto!) {\n    removeOrderItem(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveOrderItem($input: RemoveOrderItemDto!) {\n    removeOrderItem(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        staffId\n        status\n        subTotal\n        discount\n        total\n        items {\n          _id\n          orderId\n          menuItemId\n          menuItemName\n          quantity\n          unitPrice\n          totalPrice\n          note\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateOrderStatus($input: UpdateOrderStatusDto!) {\n    updateOrderStatus(input: $input) {\n      order {\n        _id\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateOrderStatus($input: UpdateOrderStatusDto!) {\n    updateOrderStatus(input: $input) {\n      order {\n        _id\n        status\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CancelOrder($input: CancelOrderDto!) {\n    cancelOrder(input: $input) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation CancelOrder($input: CancelOrderDto!) {\n    cancelOrder(input: $input) {\n      _id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ProcessPayment($input: ProcessPaymentDto!) {\n    processPayment(input: $input) {\n      payment {\n        _id\n        orderId\n        currencyId\n        method\n        amount\n        change\n        paidAt\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ProcessPayment($input: ProcessPaymentDto!) {\n    processPayment(input: $input) {\n      payment {\n        _id\n        orderId\n        currencyId\n        method\n        amount\n        change\n        paidAt\n        createdAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadCurrencies($input: LoadCurrencyDto) {\n    loadCurrencies(input: $input) {\n      count\n      currency {\n        _id\n        name\n        code\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadCurrencies($input: LoadCurrencyDto) {\n    loadCurrencies(input: $input) {\n      count\n      currency {\n        _id\n        name\n        code\n        isActive\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation TransferTable($input: TransferTableDto!) {\n    transferTable(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        status\n        total\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation TransferTable($input: TransferTableDto!) {\n    transferTable(input: $input) {\n      order {\n        _id\n        orderNumber\n        tableId\n        status\n        total\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadTable($input: LoadTableDto) {\n    loadTable(input: $input) {\n      count\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadTable($input: LoadTableDto) {\n    loadTable(input: $input) {\n      count\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoadTableById($input: LoadTableByIdDto!) {\n    loadTableById(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoadTableById($input: LoadTableByIdDto!) {\n    loadTableById(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateTable($input: CreateTableDto!) {\n    createTable(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTable($input: CreateTableDto!) {\n    createTable(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTable($input: UpdateTableDto!) {\n    updateTable(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTable($input: UpdateTableDto!) {\n    updateTable(input: $input) {\n      table {\n        _id\n        uniqueId\n        uid\n        number\n        zoneId\n        capacity\n        status\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTable($input: DeleteTableDto!) {\n    deleteTable(input: $input) {\n      table {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTable($input: DeleteTableDto!) {\n    deleteTable(input: $input) {\n      table {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RestoreTable($input: RestoreTableDto!) {\n    restoreTable(input: $input) {\n      table {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RestoreTable($input: RestoreTableDto!) {\n    restoreTable(input: $input) {\n      table {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query loadZone($input: LoadZoneDto!) {\n    loadZone(input: $input) {\n      count\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query loadZone($input: LoadZoneDto!) {\n    loadZone(input: $input) {\n      count\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createZone($input: CreateZoneDto!) {\n    createZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createZone($input: CreateZoneDto!) {\n    createZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation updateZone($input: UpdateZoneDto!) {\n    updateZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateZone($input: UpdateZoneDto!) {\n    updateZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteZone($input: DeleteZoneDto!) {\n    deleteZone(input: $input) {\n      zone {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation deleteZone($input: DeleteZoneDto!) {\n    deleteZone(input: $input) {\n      zone {\n        _id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation restoreZone($input: RestoreZoneDto!) {\n    restoreZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation restoreZone($input: RestoreZoneDto!) {\n    restoreZone(input: $input) {\n      zone {\n        _id\n        name\n        isActive\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;