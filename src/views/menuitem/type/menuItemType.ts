import { getDictionary } from "@/utils/getDictionary";
import type { AttachedFile } from "@core/components/custom-inputs";

export type MenuItemListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

export type ListMenuItemNetworkProps = {
  query: any;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
  onSuccess?: Function;
  page?: number;
  limit?: number;
  pageIndex?: number;
  pageSize?: number;
  isActive?: string;
  keyword?: string;
  categoryId?: string;
  sortField?: string;
  sortDirection?: string;
};

export type CreateMenuItemNetworkProps = {
  mutation: any;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
  name: string;
  description?: string;
  photo?: string;
  price: number;
  categoryId: string;
  menuItemFile?: AttachedFile | null;
};

export type UpdateMenuItemNetworkProps = {
  mutation: any;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
  _id: string;
  name?: string;
  description?: string;
  photo?: string;
  price?: number;
  categoryId?: string;
  menuItemFile?: AttachedFile | null;
  isActive?: string;
};

export type DeleteMenuItemNetworkProps = {
  mutation: any;
  _id: string;
};

export interface MenuItemType {
  _id: string;
  uniqueId?: number;
  uid?: string;
  name: string;
  description?: string;
  photo?: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemInput {
  _id?: string;
  name?: string;
  description?: string;
  photo?: string;
  price?: number;
  categoryId?: string;
  isActive?: string;
  page?: number;
  limit?: number;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
}

export interface MenuItemCategory {
  _id: string;
  name: string;
}
