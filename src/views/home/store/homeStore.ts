import { IEntityStatus } from "@/utils/base";
import { create } from "zustand";
import { useMutation } from "@apollo/client";
import {
  CreateNetworkProps,
  DeleteNetworkProps,
  HomeInput,
  HomeListProps,
  HomeType,
  ListNetworkProps,
  RestoreNetworkProps,
  UpdateNetworkProps,
} from "../type/homeType";
import {
  CREATE_HOME,
  UPDATE_HOME,
  DELETE_HOME,
  RESTORE_HOME,
} from "@/gql/queries/home";

export const useHomeMutations = () => {
  const [createHomeMutation] = useMutation(CREATE_HOME);
  const [updateHomeMutation] = useMutation(UPDATE_HOME);
  const [deleteHomeMutation] = useMutation(DELETE_HOME);
  const [restoreHomeMutation] = useMutation(RESTORE_HOME);

  return {
    createHomeMutation,
    updateHomeMutation,
    deleteHomeMutation,
    restoreHomeMutation,
  };
};

interface IState {
  removeListenerState: () => void;
  resetModalState: () => void;

  toggleCreateComponent: boolean;
  setToggleCreateComponent: (value: boolean) => void;

  toggleUpdateComponent: boolean;
  setToggleUpdateComponent: (value: boolean) => void;

  selectedItem: HomeType | null;
  setSelectedItem: (item: HomeType | null) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  count: number;
  pageIndex: number;
  pageSize: number;
  isActive: string;
  keyword: string;
  sortField: string | null;
  sortOrder: "ASC" | "DESC" | null;

  setPagination: (pagination: {
    pageIndex?: number;
    pageSize?: number;
    isActive?: string;
    keyword?: string;
    sortField?: string | null;
    sortOrder?: "ASC" | "DESC" | null;
  }) => void;


  setSorting: (
    sortField: string | null,
    sortOrder: "ASC" | "DESC" | null
  ) => void;

  homeList: HomeType[];

  loadHomeAPI: ({ props }: { props: ListNetworkProps }) => Promise<void>;
  searchHomeAPI: ({ props, keyword }: { props: ListNetworkProps; keyword: string; }) => Promise<void>;
  createHomeAPI: ({ props }: { props: CreateNetworkProps }) => Promise<void>;
  updateHomeAPI: ({ props }: { props: UpdateNetworkProps }) => Promise<void>;
  deleteHomeAPI: ({ props }: { props: DeleteNetworkProps }) => Promise<void>;
  restoreHomeAPI: ({ props }: { props: RestoreNetworkProps }) => Promise<void>;
}

export const useStore = create<IState>((set, get) => ({
  // ─── Reset ───────────────────────────────────────────────────────────────
  removeListenerState: () => {
    set({
      toggleCreateComponent: false,
      toggleUpdateComponent: false,
      selectedItem: null,
      pageIndex: 0,
      pageSize: 50,
      isActive: IEntityStatus.all,
    });
  },

  resetModalState: () => {
    set({
      toggleCreateComponent: false,
      toggleUpdateComponent: false,
      selectedItem: null,
    });
  },

  // ─── UI toggles ──────────────────────────────────────────────────────────
  toggleCreateComponent: false,
  setToggleCreateComponent: (value) => {
    set({ toggleCreateComponent: value });
    if (!value) {
      document.body.classList.remove("overflow-hidden");
    }
  },

  toggleUpdateComponent: false,
  setToggleUpdateComponent: (value) => {
    set({ toggleUpdateComponent: value });
  },

  selectedItem: null,
  setSelectedItem: (item) => {
    set({ selectedItem: item });
  },

  // ─── Loading ─────────────────────────────────────────────────────────────
  loading: true,
  setLoading: (value) => {
    set({ loading: value });
  },

  // ─── Pagination & Filter ─────────────────────────────────────────────────
  count: 0,
  pageIndex: 0,
  pageSize: 50,
  isActive: IEntityStatus.all,
  keyword: "",
  sortField: null,
  sortOrder: null,

  setPagination: (pagination) => {
    set({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      isActive: pagination.isActive,
      keyword: pagination.keyword,
      sortField: pagination.sortField,
      sortOrder: pagination.sortOrder,
    });
  },

  setSorting: (sortField, sortOrder) => {
    set({ sortField, sortOrder });
  },

  // ─── Data ─────────────────────────────────────────────────────────────────
  homeList: [],

  // ─── LOAD ─────────────────────────────────────────────────────────────────
  loadHomeAPI: async ({ props }) => {
    try {
      set({ loading: true });

      const { pageIndex, pageSize, isActive, keyword, sortField, sortOrder } =
        get();

      const variables: { input: HomeInput } = {
        input: {
          page: pageIndex + 1,
          limit: pageSize,
        },
      };

      if (sortField) variables.input.sortField = sortField;
      if (sortOrder) variables.input.sortDirection = sortOrder;
      if (isActive && isActive !== IEntityStatus.all)
        variables.input.isActive = isActive;
      if (keyword && keyword.trim() !== "")
        variables.input.keyword = keyword.trim();

      const result = await props.query({ variables });

      if (result.data?.loadHome) {
        set({
          homeList: result.data.loadHome.data || [],
          count: result.data.loadHome.count || 0,
        });
      } else {
        set({ homeList: [], count: 0 });
      }
    } catch (error: any) {
      set({ homeList: [], count: 0 });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ─── SEARCH ───────────────────────────────────────────────────────────────
  searchHomeAPI: async ({ props, keyword }) => {
    try {
      set({ keyword, pageIndex: 0 });
      await get().loadHomeAPI({ props });
    } catch (error: any) {
      throw error;
    }
  },

  // ─── CREATE ───────────────────────────────────────────────────────────────
  createHomeAPI: async ({ props }) => {
    try {
      set({ loading: true });

      const { homeList, count } = get();

      const input: HomeInput = {
        name: props.name,
        isActive: props.isActive,
      };

      const { data } = await props.mutation({ variables: { input } });

      if (data?.createHome?.data) {
        set({
          homeList: [data.createHome.data, ...homeList],
          count: count + 1,
        });
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  updateHomeAPI: async ({ props }) => {
    try {
      set({ loading: true });

      const { homeList } = get();

      const input: HomeInput = {
        _id: props._id,
        name: props.name,
        isActive: props.isActive,
      };

      const { data } = await props.mutation({ variables: { input } });

      if (data?.updateHome?.data) {
        set({
          homeList: homeList.map((item) =>
            item._id === props._id ? data.updateHome.data : item
          ),
        });
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ─── DELETE ───────────────────────────────────────────────────────────────
  deleteHomeAPI: async ({ props }) => {
    try {
      set({ loading: true });

      const { homeList, count } = get();

      const { data } = await props.mutation({
        variables: { input: { _id: props._id } },
      });

      if (data?.deleteHome?.data) {
        set({
          homeList: homeList.filter((item) => item._id !== props._id),
          count: count - 1,
        });
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ─── RESTORE ──────────────────────────────────────────────────────────────
  restoreHomeAPI: async ({ props }) => {
    try {
      set({ loading: true });

      const { homeList, count, isActive } = get();

      const { data } = await props.mutation({
        variables: { input: { _id: props._id } },
      });

      if (data?.restoreHome?.data) {
        if (isActive === IEntityStatus.inactive) {
          set({
            homeList: homeList.filter((item) => item._id !== props._id),
            count: count - 1,
          });
        } else if (isActive === IEntityStatus.all) {
          set({
            homeList: homeList.map((item) =>
              item._id === props._id
                ? { ...item, isActive: IEntityStatus.active }
                : item
            ),
          });
        }
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
