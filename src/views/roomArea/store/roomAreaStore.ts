import { IEntityStatus } from "@/utils/base";
import { create } from "zustand";
import { useMutation } from "@apollo/client";
import { CreateNetworkProps, UpdateNetworkProps, DeleteNetworkProps, RestoreNetworkProps, ListNetworkProps, RoomAreaType } from "../type/roomAreaType";
import { CREATE_ROOM_AREA, UPDATE_ROOM_AREA, DELETE_ROOM_AREA, RESTORE_DELETE_ROOM_AREA } from "@/gql/queries/roomArea";
import { LOAD_ZONE } from "@/gql/queries/zone";
import { LOAD_ROOM_AREA_CATEGORY } from "@/gql/queries/roomAreaCategory";
import { ApolloClient, MutationFunction } from "@apollo/client";
import { IRoomAreaSortField } from "@/utils/enumSortField";
import { CreateRoomAreaDto, CreateAreaOwnershipInput, CreateAreaOwnershipAgentInput } from "@/gql/models/graphql";

export const useRoomAreaMutations = () => {
  const [createRoomAreaMutation] = useMutation(CREATE_ROOM_AREA);
  const [updateRoomAreaMutation] = useMutation(UPDATE_ROOM_AREA);
  const [deleteRoomAreaMutation] = useMutation(DELETE_ROOM_AREA);
  const [restoreRoomAreaMutation] = useMutation(RESTORE_DELETE_ROOM_AREA);

  return { createRoomAreaMutation, updateRoomAreaMutation, deleteRoomAreaMutation, restoreRoomAreaMutation };
};

interface IState {
  removeListenerState: () => void;
  resetModalState: () => void; // Reset เฉพาะ modal states

  toggleCreateComponent: boolean;
  setToggleCreateComponent: (value: boolean) => void;

  toggleUpdateComponent: boolean;
  setToggleUpdateComponent: (value: boolean) => void;

  selectedItem: RoomAreaType | null;
  setSelectedItem: (item: RoomAreaType | null) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  count: number;
  pageIndex: number;
  pageSize: number;
  keyword: string;
  isActive: string;
  selectedZoneId: string;
  selectedCategoryId: string;
  sortField: IRoomAreaSortField | null;
  sortOrder: 'ASC' | 'DESC' | null;

  setPagination: (pagination: {
    pageIndex: number;
    pageSize: number;
    keyword?: string;
    isActive?: string;
    zoneId?: string;
    categoryId?: string;
    sortField?: IRoomAreaSortField | null;
    sortOrder?: 'ASC' | 'DESC' | null;
  }) => void;

  setSorting: (sortField: IRoomAreaSortField | null, sortOrder: 'ASC' | 'DESC' | null) => void;

  loadRoomAreaAPI: ({ props }: { props: ListNetworkProps }) => Promise<void>;
  searchRoomAreaAPI: ({ props, keyword }: { props: ListNetworkProps; keyword: string }) => Promise<void>;
  createRoomAreaAPI: ({ props }: { props: CreateNetworkProps }) => Promise<void>;
  updateRoomAreaAPI: ({ props }: { props: UpdateNetworkProps }) => Promise<void>;
  deleteRoomAreaAPI: ({ props }: { props: DeleteNetworkProps }) => Promise<void>;
  restoreRoomAreaAPI: ({ props }: { props: RestoreNetworkProps }) => Promise<void>;

  roomAreaList: RoomAreaType[];

  // Zone & Category Lists
  zoneList: Zone[];
  categoryList: Category[];
  setZoneList: (zones: Zone[]) => void;
  setCategoryList: (categories: Category[]) => void;

}

// Zone and Category types
interface Zone {
  _id: string;
  uniqueId?: number;
  uid?: string;
  isActive?: string;
  createdAt?: string;
  buId?: string;
  name: string;
}

interface Category {
  _id: string;
  uniqueId?: number;
  uid?: string;
  isActive?: string;
  createdAt?: string;
  name: string;
}

const getFileUrl = (files?: (File | string)[]): string => {
  if (!files || files.length === 0) return "";
  const firstFile = files[0];
  if (typeof firstFile === "string") return firstFile;
  return "";
};


export const sortRoomAreaData = (data: RoomAreaType[]): RoomAreaType[] => {
  if (!data || data.length === 0) return data;

  const alphanumericCompare = (a: string | undefined | null, b: string | undefined | null): number => {
    const aStr = (a || "").toLowerCase();
    const bStr = (b || "").toLowerCase();
    return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
  };

  return [...data].sort((a, b) => {
    const zoneA = a.zone?.name || "";
    const zoneB = b.zone?.name || "";
    const zoneCompare = alphanumericCompare(zoneA, zoneB);

    if (zoneCompare !== 0) return zoneCompare;

    const nameA = a.name || "";
    const nameB = b.name || "";
    return alphanumericCompare(nameA, nameB);
  });
};

export const useStore = create<IState>((set, get) => ({
  removeListenerState: () => {
    set({
      toggleCreateComponent: false,
      toggleUpdateComponent: false,
      selectedItem: null,
      pageIndex: 0,
      pageSize: 2,
      keyword: "",
      isActive: IEntityStatus.all,
      selectedZoneId: IEntityStatus.all,
      selectedCategoryId: IEntityStatus.all,
    });
  },

  // Reset เฉพาะ modal states (ไม่กระทบ loading และ data)
  resetModalState: () => {
    set({
      toggleCreateComponent: false,
      toggleUpdateComponent: false,
      selectedItem: null,
    });
  },

  toggleCreateComponent: false,
  setToggleCreateComponent: (value: boolean) => {
    set({ toggleCreateComponent: value });
    if (!value) {
      document.body.classList.remove("overflow-hidden");
    }
  },

  toggleUpdateComponent: false,
  setToggleUpdateComponent: (value: boolean) => {
    set({ toggleUpdateComponent: value });
  },

  selectedItem: null,
  setSelectedItem: (item: RoomAreaType | null) => {
    set({ selectedItem: item });
  },

  loading: true,
  setLoading: (value: boolean) => {
    set({ loading: value });
  },

  count: 0,
  pageIndex: 0,
  pageSize: 50,
  keyword: "",
  isActive: IEntityStatus.all,
  selectedZoneId: IEntityStatus.all,
  selectedCategoryId: IEntityStatus.all,
  sortField: null,
  sortOrder: null,

  setPagination: (pagination) => {
    set({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      keyword: pagination.keyword,
      isActive: pagination.isActive,
      selectedZoneId: pagination.zoneId,
      selectedCategoryId: pagination.categoryId,
      sortField: pagination.sortField,
      sortOrder: pagination.sortOrder ,
    });
  },

  setSorting: (sortField, sortOrder) => {
    set({ sortField, sortOrder });
  },

  roomAreaList: [],
  zoneList: [],
  categoryList: [],

  loadRoomAreaAPI: async ({ props }: { props: ListNetworkProps }) => {
    try {
      set({ loading: true });

      const { pageIndex, pageSize, isActive, selectedZoneId, selectedCategoryId, keyword, sortField, sortOrder } = get();

      const variables: any = {
        input: {
          page: pageIndex + 1,
          limit: pageSize,
        },
      };

      if (sortField) {
        variables.input.sortField = sortField;
      }
      if (sortOrder) {
        variables.input.sortDirection = sortOrder;
      }

      if (isActive && isActive !== IEntityStatus.all) {
        variables.input.isActive = isActive;
      }
      if (selectedZoneId && selectedZoneId !== IEntityStatus.all) {
        variables.input.zoneId = selectedZoneId;
      }

      if (selectedCategoryId && selectedCategoryId !== IEntityStatus.all) {
        variables.input.roomAreaCategoryId = selectedCategoryId;
      }
      if (keyword && keyword.trim() !== '') {
        variables.input.keyword = keyword.trim();
      }

      const result = await props.query({
        variables,
      });

      if (result.data?.loadRoomArea) {
        const allRoomAreas = result.data.loadRoomArea.roomArea || [];
        const totalCount = result.data.loadRoomArea.count || 0;

        set(() => ({
          roomAreaList: allRoomAreas,
          count: totalCount,
        }));
      } else {
        set(() => ({
          roomAreaList: [],
          count: 0,
        }));
      }
    } catch (error: any) {
      set(() => ({ roomAreaList: [], count: 0 }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  searchRoomAreaAPI: async ({ props, keyword }: { props: ListNetworkProps; keyword: string }) => {
    try {
      const { pageSize, isActive, selectedZoneId, selectedCategoryId } = get();

      set({
        keyword: keyword,
        pageIndex: 0
      });
      await get().loadRoomAreaAPI({ props });
    } catch (error: any) {
      throw error;
    }
  },

  createRoomAreaAPI: async ({ props }: { props: CreateNetworkProps }) => {
    try {
      set({ loading: true });

      const { roomAreaList, count } = get();


      const w = props.wide || 0;
      const l = props.long || 0;
      const m = props.moreArea || 0;
      const totalArea = w * l;
      const calculatedTotalArea = Number((totalArea - m).toFixed(2));

      const input: CreateRoomAreaDto = {
        name: props.name,
        wide: props.wide,
        long: props.long,
        moreArea: props.moreArea,
        totalArea: calculatedTotalArea,
        totalAreaAmount: props.totalAreaAmount || 0,
        amount: props.amount || 0,
        totalAreaCentralAmount: props.totalAreaCentralAmount || 0,
        centralAmount: props.centralAmount || 0,
        totalAmount: props.totalAmount || 0,
        currency: props.currency,
        zoneId: props.zoneId,
        roomAreaCategoryId: props.roomAreaCategoryId,
        holdStatus: props.holdStatus,
        agentHoldStatus: props.agentHoldStatus,
      };

      if (props.buyer) {
        const buyer = props.buyer;
        input.buyerObject = {
          firstName: buyer.buyerFirstName || null,
          lastName: buyer.buyerLastName || null,
          phoneNumber: buyer.buyerPhone || null,
          address: buyer.buyerAddress || null,
          fileUrl: getFileUrl(buyer.purchaseContract),
        };
      }

      if (props.transfer) {
        const transfer = props.transfer;
        input.agentObject = {
          startedAt: transfer.transferStartDate
            ? (transfer.transferStartDate instanceof Date
              ? transfer.transferStartDate.toISOString()
              : transfer.transferStartDate)
            : null,
          endedAt: transfer.transferEndDate
            ? (transfer.transferEndDate instanceof Date
              ? transfer.transferEndDate.toISOString()
              : transfer.transferEndDate)
            : null,
          note: transfer.transferRemarks || null,
          fileUrl: getFileUrl(transfer.transferContract),
        };
      }

      const { data } = await props.mutation({
        variables: { input },
      });

      if (data?.createRoomArea?.roomArea) {
        set(() => ({
          roomAreaList: [data.createRoomArea.roomArea, ...roomAreaList],
          count: count + 1,
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRoomAreaAPI: async ({ props }: { props: UpdateNetworkProps }) => {
    try {
      set({ loading: true });

      const { roomAreaList, count, } = get();

      const w = props.wide || 0;
      const l = props.long || 0;
      const m = props.moreArea || 0;
      const totalArea = w * l;
      const calculatedTotalArea = Number((totalArea - m).toFixed(2));


      const input: any = {
        _id: props.id,
        name: props.name,
        wide: props.wide,
        long: props.long,
        moreArea: props.moreArea,
        totalArea: calculatedTotalArea,
        totalAreaAmount: props.totalAreaAmount || 0,
        amount: props.amount || 0,
        totalAreaCentralAmount: props.totalAreaCentralAmount || 0,
        centralAmount: props.centralAmount || 0,
        totalAmount: props.totalAmount || 0,
        currency: props.currency,
        zoneId: props.zoneId,
        roomAreaCategoryId: props.roomAreaCategoryId,
        holdStatus: props.holdStatus,
        agentHoldStatus: props.agentHoldStatus,
      };

      if (props.buyer) {
        const buyer = props.buyer;
        input.buyerObject = {
          firstName: buyer.buyerFirstName || null,
          lastName: buyer.buyerLastName || null,
          phoneNumber: buyer.buyerPhone || null,
          address: buyer.buyerAddress || null,
          fileUrl: getFileUrl(buyer.purchaseContract),
        };
      }

      if (props.transfer) {
        const transfer = props.transfer;
        input.agentObject = {
          startedAt: transfer.transferStartDate
            ? (transfer.transferStartDate instanceof Date
              ? transfer.transferStartDate.toISOString()
              : transfer.transferStartDate)
            : null,
          endedAt: transfer.transferEndDate
            ? (transfer.transferEndDate instanceof Date
              ? transfer.transferEndDate.toISOString()
              : transfer.transferEndDate)
            : null,
          note: transfer.transferRemarks || null,
          fileUrl: getFileUrl(transfer.transferContract),
        };
      }

      const { data } = await props.mutation({
        variables: { input },
      });
      console.log(data);

      if (data?.updateRoomArea?.roomArea) {
        const updatedItem = data.updateRoomArea.roomArea;
        const { roomAreaList: currentList, selectedItem: currentSelected } = get();

        let finalUpdatedItem = { ...updatedItem };

        if (currentSelected?._id === props.id) {
          if (!finalUpdatedItem.roomAreaOwnership && currentSelected.roomAreaOwnership) {
            finalUpdatedItem.roomAreaOwnership = currentSelected.roomAreaOwnership;
          }

          if (!finalUpdatedItem.roomAreaOwnershipAgent && currentSelected.roomAreaOwnershipAgent) {
            finalUpdatedItem.roomAreaOwnershipAgent = currentSelected.roomAreaOwnershipAgent;
          }
        }

        set(() => ({
          roomAreaList: currentList.map((item) =>
            item._id === props.id ? finalUpdatedItem : item
          ),
          selectedItem: currentSelected?._id === props.id ? finalUpdatedItem : currentSelected
        }));

      }
    } catch (error: unknown) {
      throw error;
    }
  },

  deleteRoomAreaAPI: async ({ props }: { props: DeleteNetworkProps }) => {
    try {
      set({ loading: true });

      const { roomAreaList, count, isActive } = get();

      const { data } = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });



      if (isActive === IEntityStatus.active) {
        set(() => ({
          roomAreaList: roomAreaList.filter((item) => item._id !== props._id),
          count: count - 1,
        }));
      } else if (isActive === IEntityStatus.all) {
        set(() => ({
          roomAreaList: roomAreaList.map((item) =>
            item._id === props._id ? { ...item, isActive: IEntityStatus.inactive } : item
          ),
        }));
      }
    } catch (error: any) {
      throw error;
    }
  },

  restoreRoomAreaAPI: async ({ props }: { props: RestoreNetworkProps }) => {
    try {
      set({ loading: true });

      const { roomAreaList, count, isActive } = get();

      const { data } = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });


      if (isActive === IEntityStatus.inactive) {
        set(() => ({
          roomAreaList: roomAreaList.filter((item) => item._id !== props._id),
          count: count - 1,
        }));
      } else if (isActive === IEntityStatus.all) {
        set(() => ({
          roomAreaList: roomAreaList.map((item) =>
            item._id === props._id ? { ...item, isActive: IEntityStatus.active } : item
          ),
        }));
      }
    } catch (error: any) {
      throw error;
    }
  },

  setZoneList: (zones: Zone[]) => set({ zoneList: zones }),
  setCategoryList: (categories: Category[]) => set({ categoryList: categories }),

}));
