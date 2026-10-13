import { IEntityStatus } from "@/utils/base";
import { create } from "zustand";
import { useMutation } from "@apollo/client";
import {
  TableType,
  TableInput,
  TableZone,
  ListTableNetworkProps,
  CreateTableNetworkProps,
  UpdateTableNetworkProps,
  DeleteTableNetworkProps,
  RestoreTableNetworkProps,
} from "../type/tableType";
import {
  CREATE_TABLE,
  UPDATE_TABLE,
  DELETE_TABLE,
  RESTORE_TABLE,
} from "@/gql/queries/table";

export const useTableMutations = () => {
  const [createTableMutation] = useMutation(CREATE_TABLE);
  const [updateTableMutation] = useMutation(UPDATE_TABLE);
  const [deleteTableMutation] = useMutation(DELETE_TABLE);
  const [restoreTableMutation] = useMutation(RESTORE_TABLE);

  return {
    createTableMutation,
    updateTableMutation,
    deleteTableMutation,
    restoreTableMutation,
  };
};

interface IState {
  removeListenerState: () => void;
  resetModalState: () => void;

  toggleCreateComponent: boolean;
  setToggleCreateComponent: (value: boolean) => void;

  toggleUpdateComponent: boolean;
  setToggleUpdateComponent: (value: boolean) => void;

  selectedItem: TableType | null;
  setSelectedItem: (item: TableType | null) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  count: number;
  pageIndex: number;
  pageSize: number;
  isActive: string;
  keyword: string;
  selectedZone: string;

  setIsActive: (value: string) => void;
  setSelectedZone: (value: string) => void;

  setPagination: (pagination: {
    pageIndex: number;
    pageSize: number;
    isActive?: string;
    keyword?: string;
    selectedZone?: string;
  }) => void;

  loadTableAPI: ({ props }: { props: ListTableNetworkProps }) => Promise<void>;
  searchTableAPI: ({ props, keyword }: { props: ListTableNetworkProps; keyword: string }) => Promise<void>;
  createTableAPI: ({ props }: { props: CreateTableNetworkProps }) => Promise<void>;
  updateTableAPI: ({ props }: { props: UpdateTableNetworkProps }) => Promise<void>;
  deleteTableAPI: ({ props }: { props: DeleteTableNetworkProps }) => Promise<void>;
  restoreTableAPI: ({ props }: { props: RestoreTableNetworkProps }) => Promise<void>;

  tableList: TableType[];
  zoneList: TableZone[];
  setZoneList: (list: TableZone[]) => void;
}

export const useTableStore = create<IState>((set, get) => ({
  removeListenerState: () => {
    set({
      toggleCreateComponent: false,
      toggleUpdateComponent: false,
      selectedItem: null,
      pageIndex: 0,
      pageSize: 50,
      isActive: IEntityStatus.active,
      keyword: "",
      selectedZone: "",
    });
  },

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
  },

  toggleUpdateComponent: false,
  setToggleUpdateComponent: (value: boolean) => {
    set({ toggleUpdateComponent: value });
  },

  selectedItem: null,
  setSelectedItem: (item: TableType | null) => {
    set({ selectedItem: item });
  },

  loading: true,
  setLoading: (value: boolean) => {
    set({ loading: value });
  },

  count: 0,
  pageIndex: 0,
  pageSize: 50,
  isActive: IEntityStatus.active,
  keyword: "",
  selectedZone: "",

  setIsActive: (value) => set({ isActive: value, pageIndex: 0 }),
  setSelectedZone: (value) => set({ selectedZone: value, pageIndex: 0 }),

  setPagination: (pagination) => {
    set({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      isActive: pagination.isActive,
      keyword: pagination.keyword,
      selectedZone: pagination.selectedZone,
    });
  },

  tableList: [],
  zoneList: [],
  setZoneList: (list: TableZone[]) => {
    set({ zoneList: list });
  },

  loadTableAPI: async ({ props }) => {
    try {
      set({ loading: true });
      const { pageIndex, pageSize, isActive, keyword, selectedZone } = get();

      const input: TableInput = {
        page: pageIndex + 1,
        limit: pageSize,
      };

      if (isActive && isActive !== IEntityStatus.all) {
        input.isActive = isActive;
      }

      if (keyword && keyword.trim() !== "") {
        input.keyword = keyword.trim();
      }

      if (selectedZone && selectedZone.trim() !== "") {
        input.zoneId = selectedZone.trim();
      }

      const res = await props.query({
        variables: { input },
      });

      if (res?.data?.loadTable) {
        const tables = res.data.loadTable.table || [];
        const totalCount =
          res.data.loadTable.count !== undefined &&
          res.data.loadTable.count !== null
            ? res.data.loadTable.count
            : tables.length;

        set(() => ({
          tableList: tables,
          count: totalCount,
        }));
      } else {
        set(() => ({
          tableList: [],
          count: 0,
        }));
      }
    } catch (error) {
      set(() => ({ tableList: [], count: 0 }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  searchTableAPI: async ({ props, keyword }) => {
    try {
      set({
        keyword: keyword,
        pageIndex: 0
      });
      await get().loadTableAPI({ props });
    } catch (error: any) {
      throw error;
    }
  },

  createTableAPI: async ({ props }) => {
    set({ loading: true });
    try {
      const { data } = await props.mutation({
        variables: {
          input: {
            number: props.number,
            zoneId: props.zoneId,
            capacity: Number(props.capacity),
            status: props.status || "available",
          },
        },
      });

      const newTable = data?.createTable?.table;

      if (newTable) {
        set((state) => ({
          tableList: [newTable, ...state.tableList],
          count: state.count + 1,
        }));
      }

      get().resetModalState();
    } catch (error) {
      console.error("createTableAPI Error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTableAPI: async ({ props }) => {
    set({ loading: true });
    try {
      const input: TableInput = {
        _id: props._id,
      };

      if (props.number !== undefined) input.number = props.number;
      if (props.zoneId !== undefined) input.zoneId = props.zoneId;
      if (props.capacity !== undefined) input.capacity = Number(props.capacity);
      if (props.status !== undefined) input.status = props.status;
      if (props.isActive !== undefined) input.isActive = props.isActive;

      const { data } = await props.mutation({
        variables: { input },
      });

      const updatedTable = data?.updateTable?.table;

      if (updatedTable) {
        set((state) => ({
          tableList: state.tableList.map((item) =>
            item._id === props._id ? updatedTable : item
          ),
          selectedItem: updatedTable,
        }));
      }

      get().resetModalState();
    } catch (error) {
      console.error("updateTableAPI Error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteTableAPI: async ({ props }) => {
    set({ loading: true });
    try {
      const { data } = await props.mutation({
        variables: {
          input: { _id: props._id },
        },
      });

      if (data?.deleteTable?.table) {
        set((state) => ({
          tableList: state.tableList.filter((item) => item._id !== props._id),
          count: Math.max(0, state.count - 1),
        }));
      }
    } catch (error) {
      console.error("deleteTableAPI Error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  restoreTableAPI: async ({ props }) => {
    set({ loading: true });
    try {
      const { data } = await props.mutation({
        variables: {
          input: { _id: props._id },
        },
      });

      if (data?.restoreTable?.table) {
        set((state) => ({
          tableList: state.tableList.filter((item) => item._id !== props._id),
          count: Math.max(0, state.count - 1),
        }));
      }
    } catch (error) {
      console.error("restoreTableAPI Error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
