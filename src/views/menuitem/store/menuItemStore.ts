import { IEntityStatus } from "@/utils/base";
import { create } from "zustand";
import { useMutation } from "@apollo/client";
import {
  MenuItemType,
  MenuItemInput,
  MenuItemCategory,
  ListMenuItemNetworkProps,
  CreateMenuItemNetworkProps,
  UpdateMenuItemNetworkProps,
  DeleteMenuItemNetworkProps,
} from "../type/menuItemType";
import {
  CREATE_MENU_ITEM,
  UPDATE_MENU_ITEM,
  DELETE_MENU_ITEM,
} from "@/gql/queries/menuItem";
import { uploadOwnerFile } from "@/utils/fileUploadService";

const MENU_ITEM_OWNER_TYPE = "menuItem";

export const useMenuItemMutations = () => {
  const [createMenuItemMutation] = useMutation(CREATE_MENU_ITEM);
  const [updateMenuItemMutation] = useMutation(UPDATE_MENU_ITEM);
  const [deleteMenuItemMutation] = useMutation(DELETE_MENU_ITEM);

  return {
    createMenuItemMutation,
    updateMenuItemMutation,
    deleteMenuItemMutation,
  };
};

interface IState {
  removeListenerState: () => void;
  resetModalState: () => void;

  toggleCreateComponent: boolean;
  setToggleCreateComponent: (value: boolean) => void;

  toggleUpdateComponent: boolean;
  setToggleUpdateComponent: (value: boolean) => void;

  selectedItem: MenuItemType | null;
  setSelectedItem: (item: MenuItemType | null) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  count: number;
  pageIndex: number;
  pageSize: number;
  isActive: string;
  keyword: string;
  selectedCategory: string;

  setIsActive: (value: string) => void;
  setSelectedCategory: (value: string) => void;

  setPagination: (pagination: {
    pageIndex: number;
    pageSize: number;
    isActive?: string;
    keyword?: string;
    selectedCategory?: string;
  }) => void;

  loadMenuItemAPI: ({ props }: { props: ListMenuItemNetworkProps }) => Promise<void>;
  searchMenuItemAPI: ({ props, keyword }: { props: ListMenuItemNetworkProps; keyword: string }) => Promise<void>;
  createMenuItemAPI: ({ props }: { props: CreateMenuItemNetworkProps }) => Promise<void>;
  updateMenuItemAPI: ({ props }: { props: UpdateMenuItemNetworkProps }) => Promise<void>;
  deleteMenuItemAPI: ({ props }: { props: DeleteMenuItemNetworkProps }) => Promise<void>;

  menuItemList: MenuItemType[];
  categoryList: MenuItemCategory[];
  setCategoryList: (list: MenuItemCategory[]) => void;
}

export const useMenuItemStore = create<IState>((set, get) => ({
  removeListenerState: () => {
    set({
      toggleCreateComponent: false,
      toggleUpdateComponent: false,
      selectedItem: null,
      pageIndex: 0,
      pageSize: 50,
      isActive: IEntityStatus.all,
      keyword: '',
      selectedCategory: '',
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
  setSelectedItem: (item: MenuItemType | null) => {
    set({ selectedItem: item });
  },

  loading: true,
  setLoading: (value: boolean) => {
    set({ loading: value });
  },

  count: 0,
  pageIndex: 0,
  pageSize: 50,
  isActive: IEntityStatus.all,
  keyword: "",
  selectedCategory: "",

  setIsActive: (value) => set({ isActive: value, pageIndex: 0 }),
  setSelectedCategory: (value) => set({ selectedCategory: value, pageIndex: 0 }),

  setPagination: ({ pageIndex, pageSize, isActive, keyword, selectedCategory }) => {
    set((state) => ({
      pageIndex,
      pageSize,
      isActive: isActive !== undefined ? isActive : state.isActive,
      keyword: keyword !== undefined ? keyword : state.keyword,
      selectedCategory: selectedCategory !== undefined ? selectedCategory : state.selectedCategory,
    }));
  },

  menuItemList: [],
  categoryList: [],
  setCategoryList: (list: any[]) => {
    set({ categoryList: list });
  },

  loadMenuItemAPI: async ({ props }) => {
    set({ loading: true });
    try {
      const state = get();
      const page = props.page || (props.pageIndex !== undefined ? props.pageIndex + 1 : state.pageIndex + 1);
      const limit = props.limit || props.pageSize || state.pageSize;
      const isActive = props.isActive ?? state.isActive;
      const keyword = props.keyword ?? state.keyword;
      const categoryId = props.categoryId ?? state.selectedCategory;

      const input: MenuItemInput = {
        page,
        limit,
      };

      if (isActive && isActive !== IEntityStatus.all) {
        input.isActive = isActive;
      }
      if (keyword && keyword.trim() !== '') {
        input.keyword = keyword.trim();
      }
      if (categoryId && categoryId.trim() !== '') {
        input.categoryId = categoryId.trim();
      }
      if (props.sortField) {
        input.sortField = props.sortField;
      }
      if (props.sortDirection) {
        input.sortDirection = props.sortDirection;
      }

      const res = await props.query({
        variables: { input },
      });

      if (res?.data?.loadMenuItem) {
        const menuItems = res.data.loadMenuItem.menuItem || [];
        set({
          menuItemList: menuItems,
          count: res.data.loadMenuItem.count ?? menuItems.length,
        });
      } else {
        set({ menuItemList: [], count: 0 });
      }
    } catch (error) {
      set({ menuItemList: [], count: 0 });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  searchMenuItemAPI: async ({ props, keyword }) => {
    set({ keyword, pageIndex: 0 });
    await get().loadMenuItemAPI({ props });
  },

  createMenuItemAPI: async ({ props }) => {
    set({ loading: true });
    try {
      let photoUrl = props.photo || '';

      if (props.menuItemFile?.file) {
        const uploadedUrl = await uploadOwnerFile({
          file: props.menuItemFile.file,
          ownerId: `temp-${Date.now()}`,
          ownerType: MENU_ITEM_OWNER_TYPE,
          dic: props.dictionary,
        });

        if (!uploadedUrl) {
          throw new Error(props.dictionary?.uploadFileFailedCannotSave || props.dictionary?.uploadError);
        }

        photoUrl = uploadedUrl;
      } else if (props.menuItemFile?.url) {
        photoUrl = props.menuItemFile.url;
      }

      const { data } = await props.mutation({
        variables: {
          input: {
            name: props.name,
            description: props.description,
            photo: photoUrl,
            price: Number(props.price),
            categoryId: props.categoryId,
          },
        },
      });

      const newMenuItem = data?.createMenuItem?.menuItem;

      if (newMenuItem) {
        set((state) => ({
          menuItemList: [newMenuItem, ...state.menuItemList],
          count: state.count + 1,
        }));
      }

      get().resetModalState();
    } catch (error) {
      console.error('createMenuItemAPI Error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMenuItemAPI: async ({ props }) => {
    set({ loading: true });
    try {
      let photoUrl = props.photo;

      if (props.menuItemFile?.file) {
        const uploadedUrl = await uploadOwnerFile({
          file: props.menuItemFile.file,
          ownerId: props._id,
          ownerType: MENU_ITEM_OWNER_TYPE,
          dic: props.dictionary,
        });

        if (!uploadedUrl) {
          throw new Error(props.dictionary?.uploadFileFailedCannotSave || props.dictionary?.uploadError);
        }

        photoUrl = uploadedUrl;
      } else if (props.menuItemFile?.url) {
        photoUrl = props.menuItemFile.url;
      } else if (props.menuItemFile === null) {
        photoUrl = '';
      }

      const input: MenuItemInput = {
        _id: props._id,
      };

      if (props.name !== undefined) input.name = props.name;
      if (props.description !== undefined) input.description = props.description;
      if (props.price !== undefined) input.price = Number(props.price);
      if (props.categoryId !== undefined) input.categoryId = props.categoryId;
      if (photoUrl !== undefined) input.photo = photoUrl;
      if (props.isActive !== undefined) input.isActive = props.isActive;

      const { data } = await props.mutation({
        variables: { input },
      });

      const updatedMenuItem = data?.updateMenuItem?.menuItem;

      if (updatedMenuItem) {
        set((state) => ({
          menuItemList: state.menuItemList.map((item) =>
            item._id === props._id ? updatedMenuItem : item
          ),
          selectedItem: updatedMenuItem,
        }));
      }

      get().resetModalState();
    } catch (error) {
      console.error('updateMenuItemAPI Error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMenuItemAPI: async ({ props }) => {
    set({ loading: true });
    try {
      const { data } = await props.mutation({
        variables: {
          input: { _id: props._id },
        },
      });

      if (data?.deleteMenuItem?.menuItem) {
        set((state) => ({
          menuItemList: state.menuItemList.filter((item) => item._id !== props._id),
          count: Math.max(0, state.count - 1),
        }));
      }
    } catch (error) {
      console.error('deleteMenuItemAPI Error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
