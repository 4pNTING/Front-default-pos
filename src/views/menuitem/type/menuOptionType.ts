export interface MenuOptionType {
  _id?: string;
  menuItemId: string;
  name: string;
  extraPrice: number;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuOptionNetworkProps {
  mutation: any;
  menuItemId: string;
  name: string;
  extraPrice: number;
}

export interface UpdateMenuOptionNetworkProps {
  mutation: any;
  _id: string;
  name?: string;
  extraPrice?: number;
  isActive?: string;
}

export interface DeleteMenuOptionNetworkProps {
  mutation: any;
  _id: string;
}

export interface LoadMenuOptionNetworkProps {
  query: any;
  menuItemId: string;
}
