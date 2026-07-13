import { getDictionary } from "@/utils/getDictionary";

export type RoomAreaListProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: string;
};

export type ListNetworkProps = {
  query: any;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onSuccess?: Function;
  pageIndex?: number;
  pageSize?: number;
};

export type CreateNetworkProps = {
  lang?: string;
  mutation?: any;
  name: string;
  wide?: number;
  long?: number;
  moreArea?: number;
  // Direct Backend Mapping:
  totalAreaAmount?: number;           // Rent price per m² (ค่าเช่า/m²)
  totalAreaCentralAmount?: number;    // Common fee per m² (ค่าส่วนกลาง/m²)
  amount?: number;                    // Room total price (ค่าห้องรวม)
  centralAmount?: number;             // Total common fee (รวมส่วนกลาง)
  totalAmount?: number;               // Grand total (มูลค่ารวม)

  currency?: string;
  zoneId?: string;
  roomAreaCategoryId?: string;
  status?: string;           // 'active' = ใช้งาน, 'inactive' = ปิดใช้งาน
  holdStatus: string;        // 'rent' = เช่า, 'buyer' = ซื้อ
  agentHoldStatus: string;   // 'owner' = เจ้าของ, 'agent' = ตัวแทน, 'bu' = BU

  // Buyer information (Case 2 & 3)
  buyer?: {
    buyerFirstName: string;
    buyerLastName: string;
    buyerPhone: string;
    buyerAddress: string;
    purchaseContract?: (File | string)[]; // Attachments for purchase contract
  };

  // Transfer information (Case 3)
  transfer?: {
    transferStartDate: Date | null;
    transferEndDate: Date | null;
    transferRemarks?: string;
    transferContract?: (File | string)[]; // Attachments for transfer contract
  };
};

export type UpdateNetworkProps = {
  id: string;
  dictionary?: Awaited<ReturnType<typeof getDictionary>>;
  lang?: string;
  mutation?: any;
  name?: string;
  wide?: number;
  long?: number;
  moreArea?: number;
  // Direct Backend Mapping:
  totalAreaAmount?: number;
  totalAreaCentralAmount?: number;
  amount?: number;
  centralAmount?: number;
  totalAmount?: number;

  currency?: string;
  zoneId?: string;
  roomAreaCategoryId?: string;
  status?: string;
  holdStatus?: string;
  agentHoldStatus?: string;

  // Buyer information (Case 2 & 3)
  buyer?: {
    buyerFirstName: string;
    buyerLastName: string;
    buyerPhone: string;
    buyerAddress: string;
    purchaseContract?: (File | string)[];
  };

  // Transfer information (Case 3)
  transfer?: {
    transferStartDate: Date | null;
    transferEndDate: Date | null;
    transferRemarks?: string;
    transferContract?: (File | string)[];
  };
};

export type DeleteNetworkProps = {
  mutation: any;
  _id: string;
};

export type RestoreNetworkProps = {
  mutation: any;
  _id: string;
};

export interface RoomAreaType {
  _id: string;
  uid?: string;
  uniqueId?: number;
  name: string;
  wide?: number;
  long?: number;
  moreArea?: number;
  totalArea?: number;          // Calculated: wide * long - moreArea
  // Backend schema (response from server) - SWAPPED FIELDS:
  totalAreaAmount?: number;    // Backend: Rent price per m² (ค่าเช่า/m²)
  amount?: number;             // Backend: Room total price = totalArea × totalAreaAmount (ค่าห้องรวม)
  totalAreaCentralAmount?: number; // Backend: Common fee per m² (ค่าส่วนกลาง/m²) - SWAPPED!
  centralAmount?: number;      // Backend: Total common fee = totalArea × totalAreaCentralAmount (รวมส่วนกลาง) - SWAPPED!
  totalAmount?: number;        // Grand total = amount + centralAmount (มูลค่ารวม)
  currency?: string;
  zoneId?: string;
  roomAreaCategoryId?: string;
  zone?: {
    name: string;
  };
  roomAreaCategory?: {
    name: string;
  };


  // Status Fields
  status?: string;
  holdStatus?: string;        // 'rent' = เช่า, 'buyer' = ซื้อ
  agentHoldStatus?: string;   // 'owner' = เจ้าของ, 'agent' = ตัวแทน, 'bu' = BU

  // Buyer information (Case 2 & 3)
  buyerObject?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    fileUrl?: string;
  };

  // Agent/Transfer information (Case 3)
  agentObject?: {
    startedAt: string;
    endedAt: string;
    note?: string;
    fileUrl?: string;
  };

  buId?: string;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations (populated by backend)
  roomAreaOwnership?: RoomAreaOwnershipType;
  roomAreaOwnershipAgent?: RoomAreaOwnershipAgentType;
}

export interface RoomAreaOwnershipType {
  _id: string;
  uniqueId?: number;
  uid?: string;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
  buId?: string;
  roomAreaId?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  fileUrl?: string;
  status?: string;
}

export interface RoomAreaOwnershipAgentType {
  _id: string;
  uniqueId?: number;
  uid?: string;
  isActive?: string;
  createdAt?: string;
  updatedAt?: string;
  buId?: string;
  roomAreaId?: string;
  roomAreaOwnershipId?: string;
  status?: string;
  startedAt?: string;
  endedAt?: string;
  note?: string;
  fileUrl?: string;
}
