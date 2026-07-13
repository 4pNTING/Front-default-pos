import { create } from "zustand";
import { useMutation } from "@apollo/client";
import { IEntityStatus } from "@/utils/base";
import {
  CreateNetworkProps,
  ListNetworkProps,
  UpdateNetworkProps,
  DeleteNetworkProps,
  RestoreNetworkProps,
  CategoryType,
  CategoryInput
} from "@/views/category/type/categoryType";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  RESTORE_CATEGORY
} from "@/gql/queries/category";

export const useCategoryMutations = () => {
  const [createCategoryMutation] = useMutation(CREATE_CATEGORY);
  const [updateCategoryMutation] = useMutation(UPDATE_CATEGORY);
  const [deleteCategoryMutation] = useMutation(DELETE_CATEGORY);
  const [restoreCategoryMutation] = useMutation(RESTORE_CATEGORY);

  return { createCategoryMutation, updateCategoryMutation, deleteCategoryMutation, restoreCategoryMutation };
};

interface IState {
  removeListenerState: () => void;
  resetModalState: () => void;

  toggleCreateComponent: boolean;
  setToggleCreateComponent: (value: boolean) => void;

  toggleUpdateComponent: boolean;
  setToggleUpdateComponent: (value: boolean) => void;

  selectedItem: CategoryType | null;
  setSelectedItem: (item: CategoryType | null) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  count: number;
  pageIndex: number;
  pageSize: number;
  isActive: string;
  keyword: string;
  sortField: string | null;
  sortOrder: 'ASC' | 'DESC' | null;

  setPagination: (pagination: {
    pageIndex: number;
    pageSize: number;
    isActive: string;
    keyword: string;
    sortField: string | null;
    sortOrder: 'ASC' | 'DESC' | null;
  }) => void;


  setSorting: (sortField: string | null, sortOrder: 'ASC' | 'DESC' | null) => void;
  setIsActive: (value: any) => void;
  setKeyword: (value: string) => void;

  loadCategoryAPI: ({ props }: { props: ListNetworkProps }) => Promise<void>;
  searchCategoryAPI: ({ props, keyword }: { props: ListNetworkProps; keyword: string }) => Promise<void>;
  createCategoryAPI: ({ props }: { props: CreateNetworkProps }) => Promise<void>;
  updateCategoryAPI: ({ props }: { props: UpdateNetworkProps }) => Promise<void>;
  deleteCategoryAPI: ({ props }: { props: DeleteNetworkProps }) => Promise<void>;
  restoreCategoryAPI: ({ props }: { props: RestoreNetworkProps }) => Promise<void>;

  categoryList: CategoryType[];
}

export const useCategoryStore = create<IState>((set, get) => ({
  removeListenerState: () => {
    set({
      toggleCreateComponent: false,
      toggleUpdateComponent: false,
      selectedItem: null,
      pageIndex: 0,
      pageSize: 50,
      isActive: IEntityStatus.all,
      sortField: null,
      sortOrder: null,
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
    if (!value) {
      document.body.classList.remove("overflow-hidden");
    }
  },

  toggleUpdateComponent: false,
  setToggleUpdateComponent: (value: boolean) => {
    set({ toggleUpdateComponent: value });
  },

  selectedItem: null,
  setSelectedItem: (item: CategoryType | null) => {
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

  setIsActive: (value) => {
    set({ isActive: value });
  },

  setKeyword: (value) => {
    set({ keyword: value });
  },

  categoryList: [],

  loadCategoryAPI: async ({ props }: { props: ListNetworkProps }) => {
    try {
      set({ loading: true });
      const { pageIndex, pageSize, isActive, keyword, sortField, sortOrder } = get();

      const variables: { input: CategoryInput } = {
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

      if (keyword && keyword.trim() !== "") {
        variables.input.keyword = keyword.trim();
      }

      const result = await props.query({
        variables,
      });

      if (result.data?.loadCategory) {
        const categories = result.data.loadCategory.category || [];
        const totalCount = result.data.loadCategory.count || 0;

        set(() => ({
          categoryList: categories,
          count: totalCount,
        }));
      } else {
        set(() => ({
          categoryList: [],
          count: 0,
        }));
      }
    } catch (error: any) {
      set(() => ({ categoryList: [], count: 0 }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  searchCategoryAPI: async ({ props, keyword }) => {
    try {
      set({
        keyword: keyword,
        pageIndex: 0
      });
      await get().loadCategoryAPI({ props });
    } catch (error: any) {
      throw error;
    }
  },

  createCategoryAPI: async ({ props }: { props: CreateNetworkProps }) => {
    try {
      set({ loading: true });

      const { categoryList, count } = get();

      const result = await props.mutation({
        variables: { input: props.name },
      });


      if (result.data?.createCategory?.category) {
        set(() => ({
          categoryList: [result.data.createCategory.category, ...categoryList],
          count: count + 1,
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCategoryAPI: async ({ props }: { props: UpdateNetworkProps }) => {
    try {
      set({ loading: true });

      const { categoryList } = get();

      const input: any = {
        _id: props._id,
        name: props.name,

      };

      const result = await props.mutation({
        variables: { input },
      });

      if (result.data?.updateCategory?.category) {
        set(() => ({
          categoryList: categoryList.map((item) =>
            item._id === props._id ? result.data.updateCategory.category : item
          ),
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteCategoryAPI: async ({ props }: { props: DeleteNetworkProps }) => {
    try {
      set({ loading: true });

      const { categoryList, count } = get();

      const result = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });

      if (result.data?.deleteCategory?.category) {
        set(() => ({
          categoryList: categoryList.filter((item) => item._id !== props._id),
          count: count - 1,
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  restoreCategoryAPI: async ({ props }: { props: RestoreNetworkProps }) => {
    try {
      set({ loading: true });

      const { categoryList, count, isActive } = get();

      const result = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });

      if (result.data?.restoreCategory?.category) {
        if (isActive === IEntityStatus.inactive) {
          set(() => ({
            categoryList: categoryList.filter((item) => item._id !== props._id),
            count: count - 1,
          }));
        } else if (isActive === IEntityStatus.all) {
          set(() => ({
            categoryList: categoryList.map((item) =>
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
