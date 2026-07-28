import { getDictionary } from "@/utils/getDictionary";
import type { AttachedFile } from "@core/components/custom-inputs";

export type CustomerListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
  loadCustomerCall?: any;
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
  dictionary?: Awaited<ReturnType<typeof getDictionary>>; 
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  nationality?: string;
  province?: string;
  district?: string;
  village?: string;
  fileUrl?: string;
  customerFile?: AttachedFile | null;
  contact?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    province?: string;
    district?: string;
    village?: string;
  };
};

export type UpdateNetworkProps = {
  mutation: any;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>; 
  _id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  nationality?: string;
  province?: string;
  district?: string;
  village?: string;
  fileUrl?: string;
  customerFile?: AttachedFile | null;
  contact?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    province?: string;
    district?: string;
    village?: string;
  };
  deleteContact?: boolean;
};

export type RestoreNetworkProps = {
  mutation: any;
  _id: string;
};

export type DeleteNetworkProps = {
  mutation: any;
  _id: string;
};



export interface CustomerType {
  _id?: string;
  uniqueId?: number;
  uid?: string;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  buId?: string;

  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  nationality?: string;
  province?: string;
  district?: string;
  village?: string;
  fileUrl?: string;

  contact?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    province?: string;
    district?: string;
    village?: string;
  };
}


export interface CustomerInput {
  _id?: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
  nationality?: string | null;
  province?: string | null;
  district?: string | null;
  village?: string | null;
  fileUrl?: string | null;

  contact?: {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    province?: string | null;
    district?: string | null;
    village?: string | null;
  };
  deleteContact?: boolean;


  page?: number;
  limit?: number;
  isActive?: string;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
}
