import { getDictionary } from "@/utils/getDictionary";

export type TableListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

export type TableStatus = "available" | "occupied" | "reserved";

export interface TableZone {
  _id: string;
  name: string;
}

export interface TableType {
  _id: string;
  uniqueId?: number;
  uid?: string;
  number: string;
  zoneId: string;
  zoneName?: string;
  capacity: number;
  status: TableStatus;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TableInput {
  _id?: string;
  number?: string;
  zoneId?: string;
  capacity?: number;
  status?: TableStatus;
  isActive?: string;
  page?: number;
  limit?: number;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
}

export type ListTableNetworkProps = {
  query: any;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
  onSuccess?: Function;
  page?: number;
  limit?: number;
  pageIndex?: number;
  pageSize?: number;
  isActive?: string;
  keyword?: string;
  zoneId?: string;
  sortField?: string;
  sortDirection?: string;
};

export type CreateTableNetworkProps = {
  mutation: any;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
  number: string;
  zoneId: string;
  capacity: number;
  status?: TableStatus;
};

export type UpdateTableNetworkProps = {
  mutation: any;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
  _id: string;
  number?: string;
  zoneId?: string;
  capacity?: number;
  status?: TableStatus;
  isActive?: string;
};

export type DeleteTableNetworkProps = {
  mutation: any;
  _id: string;
};

export type RestoreTableNetworkProps = {
  mutation: any;
  _id: string;
};
