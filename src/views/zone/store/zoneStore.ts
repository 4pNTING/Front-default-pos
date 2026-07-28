// Zone Store - ใช้ GraphQL Query/Mutations จาก Component
import { IEntityStatus } from "@/utils/base";
import { create } from "zustand";
import { useMutation } from "@apollo/client";
import { CreateNetworkProps, UpdateNetworkProps, DeleteNetworkProps, RestoreNetworkProps, ListNetworkProps, ZoneType } from "../type/zoneType";
import { CREATE_ZONE, UPDATE_ZONE, DELETE_ZONE, RESTORE_DELETE_ZONE } from "@/gql/queries/zone";
import { IZoneSortField } from "@/utils/enumSortField";

export const useZoneMutations = () => {
  const [createZoneMutation] = useMutation(CREATE_ZONE);
  const [updateZoneMutation] = useMutation(UPDATE_ZONE);
  const [deleteZoneMutation] = useMutation(DELETE_ZONE);
  const [restoreZoneMutation] = useMutation(RESTORE_DELETE_ZONE);

  return {
    createZoneMutation,
    updateZoneMutation,
    deleteZoneMutation,
    restoreZoneMutation,
  };
};

interface IState {
  removeListenerState: () => void;

  toggleCreateComponent: boolean;
  setToggleCreateComponent: (value: boolean) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  count: number;
  pageIndex: number;
  pageSize: number;
  search: string;
  isActive: string;

  setPagination: (pagination: {
    pageIndex: number;
    pageSize: number;
    search: string;
    isActive: string;
  }) => void;


  sortField: IZoneSortField | null;
  sortOrder: 'ASC' | 'DESC' | null;
  setSorting: (field: IZoneSortField | null, order: 'ASC' | 'DESC' | null) => void;

  loadZoneAPI: ({ props, params }: { props: ListNetworkProps; params?: { pageIndex?: number; pageSize?: number; search?: string; isActive?: string } }) => Promise<void>;
  searchZoneAPI: ({ props, keyword }: { props: ListNetworkProps; keyword: string }) => Promise<void>;
  createZoneAPI: ({ props }: { props: CreateNetworkProps }) => Promise<void>;
  updateZoneAPI: ({ props }: { props: UpdateNetworkProps }) => Promise<void>;
  deleteZoneAPI: ({ props }: { props: DeleteNetworkProps }) => Promise<void>;
  restoreZoneAPI: ({ props }: { props: RestoreNetworkProps }) => Promise<void>;

  zoneList: ZoneType[];
}

export const useStore = create<IState>((set, get) => ({
  removeListenerState: () => {
    set({
      toggleCreateComponent: false,
      loading: true,
      count: 0,
      pageIndex: 0,
      pageSize: 50,
      search: "",
      isActive: IEntityStatus.active,
      zoneList: [],
    });
  },

  toggleCreateComponent: false,
  setToggleCreateComponent: (state: boolean) => {
    set({ toggleCreateComponent: state });
  },

  loading: true,
  setLoading: (loading: boolean) => {
    set({ loading: loading });
  },

  count: 0,
  pageIndex: 0,
  pageSize: 50,

  search: "",
  isActive: IEntityStatus.active,

  setPagination: (pagination) => {
    set({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: pagination.search,
      isActive: pagination.isActive,
    });
  },




  sortField: null,
  sortOrder: null,
  setSorting: (field, order) => {
    set({ sortField: field, sortOrder: order });
  },

  zoneList: [],

  loadZoneAPI: async ({ props }: { props: ListNetworkProps }) => {
    try {
      set({ loading: true });

      const { pageIndex, pageSize, isActive, search, sortField, sortOrder } = get();

      const variables: any = {
        input: {
          page: pageIndex + 1,
          limit: pageSize,
        },
      };

      if (sortField && sortOrder) {
        variables.input.sortField = sortField;
        variables.input.sortDirection = sortOrder;
      }

      if (isActive && isActive !== IEntityStatus.all) {
        variables.input.isActive = isActive;
      }

      if (search && search.trim() !== "") {
        variables.input.keyword = search.trim();
      }

      const result = await props.query({
        variables,
      });

      if (result.data?.loadZone) {
        const zones = result.data.loadZone.zone || [];
        const totalCount = result.data.loadZone.count || 0;

        set(() => ({
          zoneList: zones,
          count: totalCount,
        }));
      } else {
        set(() => ({
          zoneList: [],
          count: 0,
        }));
      }
    } catch (error: any) {
      set(() => ({ zoneList: [], count: 0 }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  searchZoneAPI: async ({ props, keyword }: { props: ListNetworkProps; keyword: string }) => {
    try {
      set({
        search: keyword,
        pageIndex: 0,
      });
      await get().loadZoneAPI({ props });
    } catch (error: any) {
      throw error;
    }
  },

  createZoneAPI: async ({ props }: { props: CreateNetworkProps }) => {
    try {
      const { zoneList, count } = get();
      set({ loading: true });

      if (!props.mutation) {
        throw new Error("Mutation function is required");
      }

      const { data } = await props.mutation({
        variables: {
          input: {
            name: props.name,
          },
        },
      });

      if (data?.createZone?.zone) {
        set(() => ({
          zoneList: [data.createZone.zone, ...zoneList],
          count: count + 1,
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateZoneAPI: async ({ props }: { props: UpdateNetworkProps }) => {
    try {
      const { zoneList } = get();
      set({ loading: true });

      const { data } = await props.mutation({
        variables: {
          input: {
            _id: props._id,
            name: props.name,
          },
        },
      });

      if (data?.updateZone?.zone) {
        set(() => ({
          zoneList: zoneList.map((item) =>
            item._id === props._id ? data.updateZone.zone : item
          ),
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteZoneAPI: async ({ props }: { props: DeleteNetworkProps }) => {
    try {
      set({ loading: true });

      const { data } = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });

      if (!data?.deleteZone) {
        throw new Error("Failed to delete zone");
      }

      const { zoneList, count } = get();
      set(() => ({
        zoneList: zoneList.filter((item) => item._id !== props._id),
        count: count > 0 ? count - 1 : 0,
      }));

    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  restoreZoneAPI: async ({ props }: { props: RestoreNetworkProps }) => {
    try {
      set({ loading: true });

      const { zoneList, count, isActive } = get();

      const { data } = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });

      if (data?.restoreDeleteZone?.zone) {
        if (isActive === IEntityStatus.inactive) {
          set(() => ({
            zoneList: zoneList.filter((item) => item._id !== props._id),
            count: count - 1,
          }));
        } else if (isActive === IEntityStatus.all) {
          set(() => ({
            zoneList: zoneList.map((item) =>
              item._id === props._id ? { ...item, isActive: IEntityStatus.active } : item
            ),
          }));
        }
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
