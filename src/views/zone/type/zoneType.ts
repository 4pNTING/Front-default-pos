import { getDictionary } from '@/utils/getDictionary';

export type ZoneListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

export type ListNetworkProps = {
  query: any; // GraphQL query function from useLazyQuery
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onSuccess?: Function;
  page?: number;
  limit?: number;
  isActive?: string;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
  pageIndex?: number;
  pageSize?: number;
};

export type CreateNetworkProps = {
  mutation: any;
  name: string;
};

export type UpdateNetworkProps = {
  mutation: any;
  _id: string;
  name: string;
};

export type DeleteNetworkProps = {
  mutation: any;
  _id: string;
};

export type RestoreNetworkProps = {
  mutation: any;
  _id: string;
};

// Zone Type - ตรงกับ GraphQL response
export interface ZoneType {
  _id?: string | null;
  uniqueId?: number | null;
  uid?: string | null;
  buId?: string | null;
  name?: string | null;
  isActive?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
