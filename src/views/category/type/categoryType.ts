import { getDictionary } from "@/utils/getDictionary";

export type CategoryListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
  loadCategoryCall?: any;
};

export type ListNetworkProps = {
  query: any;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onSuccess?: Function;
  page?: number;
  limit?: number;
  pageIndex?: number;
  pageSize?: number;
  isActive?: string;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
};

export type CreateNetworkProps = {
  mutation: any;
  name: string;
  description?: string;
  photo?: string;
  isActive?: string;
};


export type UpdateNetworkProps = {
  mutation: any;
  _id: string;
  name?: string;
  description?: string;
  photo?: string;
  isActive?: string;
};


export type DeleteNetworkProps = {
  mutation: any;
  _id: string;
};

export type RestoreNetworkProps = {
  mutation: any;
  _id: string;
};

export interface CategoryType {
  _id?: string;
  name: string;
  description?: string;
  photo?: string;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryInput {
  _id?: string;
  name?: string | null;
  description?: string | null;
  photo?: string | null;
  isActive?: string | null;
  
  page?: number;
  limit?: number;
  keyword?: string | null;
  sortField?: string | null;
  sortDirection?: string | null;
}
