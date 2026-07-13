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

export type Category = {
  __typename?: 'Category';
  _id?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
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

export type CreateZoneDto = {
  isActive?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateZoneResponse = {
  __typename?: 'CreateZoneResponse';
  zone?: Maybe<Zone>;
};

export type DeleteCategoryDto = {
  _id: Scalars['String']['input'];
};

export type DeleteCategoryResponse = {
  __typename?: 'DeleteCategoryResponse';
  category?: Maybe<Category>;
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
  isActive?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type LoadCategoryResponse = {
  __typename?: 'LoadCategoryResponse';
  category: Array<Category>;
  count: Scalars['Int']['output'];
};

export type LoadZoneByIdDto = {
  _id: Scalars['String']['input'];
};

export type LoadZoneByIdResponse = {
  __typename?: 'LoadZoneByIdResponse';
  zone?: Maybe<Zone>;
};

export type LoadZoneDto = {
  isActive: ActiveStatus;
  keyword?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type LoadZoneResponse = {
  __typename?: 'LoadZoneResponse';
  count: Scalars['Int']['output'];
  zone: Array<Zone>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: CreateCategoryResponse;
  createZone: CreateZoneResponse;
  deleteCategory: DeleteCategoryResponse;
  deleteZone: DeleteZoneResponse;
  login: AuthLoginResponse;
  restoreCategory: RestoreCategoryResponse;
  restoreZone: RestoreZoneResponse;
  updateCategory: UpdateCategoryResponse;
  updateZone: UpdateZoneResponse;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryDto;
};


export type MutationCreateZoneArgs = {
  input: CreateZoneDto;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryDto;
};


export type MutationDeleteZoneArgs = {
  input: DeleteZoneDto;
};


export type MutationLoginArgs = {
  loginData: AuthLoginArgs;
};


export type MutationRestoreCategoryArgs = {
  input: RestoreCategoryDto;
};


export type MutationRestoreZoneArgs = {
  input: RestoreZoneDto;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryDto;
};


export type MutationUpdateZoneArgs = {
  input: UpdateZoneDto;
};

export type Query = {
  __typename?: 'Query';
  loadCategory: LoadCategoryResponse;
  loadCategoryById?: Maybe<LoadCategoryByIdResponse>;
  loadZone: LoadZoneResponse;
  loadZoneById: LoadZoneByIdResponse;
};


export type QueryLoadCategoryArgs = {
  input?: InputMaybe<LoadCategoryDto>;
};


export type QueryLoadCategoryByIdArgs = {
  input: LoadCategoryByIdDto;
};


export type QueryLoadZoneArgs = {
  input: LoadZoneDto;
};


export type QueryLoadZoneByIdArgs = {
  input: LoadZoneByIdDto;
};

export type RestoreCategoryDto = {
  _id: Scalars['String']['input'];
};

export type RestoreCategoryResponse = {
  __typename?: 'RestoreCategoryResponse';
  category?: Maybe<Category>;
};

export type RestoreZoneDto = {
  _id: Scalars['String']['input'];
};

export type RestoreZoneResponse = {
  __typename?: 'RestoreZoneResponse';
  zone?: Maybe<Zone>;
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
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LoginMutationVariables = Exact<{
  input: AuthLoginArgs;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthLoginResponse', _id?: string | null, username?: string | null, role?: string | null, isActive?: string | null, token?: string | null, refreshToken?: string | null } };

export type LoadCategoryQueryVariables = Exact<{
  input?: InputMaybe<LoadCategoryDto>;
}>;


export type LoadCategoryQuery = { __typename?: 'Query', loadCategory: { __typename?: 'LoadCategoryResponse', count: number, category: Array<{ __typename?: 'Category', _id?: string | null, createdAt?: any | null, updatedAt?: any | null, description?: string | null, isActive?: string | null, name: string, photo?: string | null }> } };

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

export type LoadZoneQueryVariables = Exact<{
  input: LoadZoneDto;
}>;


export type LoadZoneQuery = { __typename?: 'Query', loadZone: { __typename?: 'LoadZoneResponse', count: number, zone: Array<{ __typename?: 'Zone', _id?: string | null, name: string, isActive?: string | null, createdAt?: any | null, updatedAt?: any | null }> } };

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
export const LoadCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadCategoryDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<LoadCategoryQuery, LoadCategoryQueryVariables>;
export const LoadCategoryByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoadCategoryById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadCategoryByIdDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<LoadCategoryByIdQuery, LoadCategoryByIdQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photo"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const RestoreCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RestoreCategoryDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<RestoreCategoryMutation, RestoreCategoryMutationVariables>;
export const LoadZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"loadZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoadZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loadZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LoadZoneQuery, LoadZoneQueryVariables>;
export const CreateZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateZoneMutation, CreateZoneMutationVariables>;
export const UpdateZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateZoneMutation, UpdateZoneMutationVariables>;
export const DeleteZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteZoneMutation, DeleteZoneMutationVariables>;
export const RestoreZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"restoreZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RestoreZoneDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<RestoreZoneMutation, RestoreZoneMutationVariables>;
export type CustomerType = any;
export type HomeType = any;
export type RoomAreaType = any;

export type ShopCategoryType = any;

export type CreateRoomAreaDto = any;
export type CreateAreaOwnershipInput = any;
export type CreateAreaOwnershipAgentInput = any;
export type Role = any;
