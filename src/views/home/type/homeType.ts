import { getDictionary } from "@/utils/getDictionary";

export type HomeListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
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
  name?: string;
  isActive?: string;
};

export type UpdateNetworkProps = {
  mutation: any;
  _id: string;
  name?: string;
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

export interface HomeInput {
  _id?: string;
  name?: string | null;
  isActive?: string;
  page?: number;
  limit?: number;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
}

export interface HomeType {
  _id?: string;
  name?: string;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
