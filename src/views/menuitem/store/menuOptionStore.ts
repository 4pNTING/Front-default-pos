import { create } from "zustand";
import { useMutation } from "@apollo/client";
import {
  MenuOptionType,
  CreateMenuOptionNetworkProps,
  UpdateMenuOptionNetworkProps,
  DeleteMenuOptionNetworkProps,
  LoadMenuOptionNetworkProps,
} from "../type/menuOptionType";
import {
  CREATE_MENU_OPTION,
  UPDATE_MENU_OPTION,
  DELETE_MENU_OPTION,
} from "@/gql/queries/menuOption";

export const useMenuOptionMutations = () => {
  const [createMenuOptionMutation] = useMutation(CREATE_MENU_OPTION);
  const [updateMenuOptionMutation] = useMutation(UPDATE_MENU_OPTION);
  const [deleteMenuOptionMutation] = useMutation(DELETE_MENU_OPTION);

  return {
    createMenuOptionMutation,
    updateMenuOptionMutation,
    deleteMenuOptionMutation,
  };
};

interface IMenuOptionState {
  options: MenuOptionType[];
  loading: boolean;
  targetMenuItem: { _id: string; name: string } | null;
  isModalOpen: boolean;

  openOptionsModal: (item: { _id: string; name: string }) => void;
  closeOptionsModal: () => void;

  loadMenuOptionsAPI: ({ props }: { props: LoadMenuOptionNetworkProps }) => Promise<void>;
  createMenuOptionAPI: ({ props }: { props: CreateMenuOptionNetworkProps }) => Promise<void>;
  updateMenuOptionAPI: ({ props }: { props: UpdateMenuOptionNetworkProps }) => Promise<void>;
  deleteMenuOptionAPI: ({ props }: { props: DeleteMenuOptionNetworkProps }) => Promise<void>;
}

export const useMenuOptionStore = create<IMenuOptionState>((set, get) => ({
  options: [],
  loading: false,
  targetMenuItem: null,
  isModalOpen: false,

  openOptionsModal: (item) => {
    set({
      targetMenuItem: item,
      isModalOpen: true,
      options: [],
    });
  },

  closeOptionsModal: () => {
    set({
      targetMenuItem: null,
      isModalOpen: false,
      options: [],
    });
  },

  loadMenuOptionsAPI: async ({ props }) => {
    try {
      set({ loading: true });
      const result = await props.query({
        variables: {
          input: {
            menuItemId: props.menuItemId,
          },
        },
      });

      const list = result.data?.loadMenuOptionByMenuItem?.menuOption || [];
      set({ options: list });
    } catch (error) {
      set({ options: [] });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createMenuOptionAPI: async ({ props }) => {
    try {
      set({ loading: true });
      const { options } = get();

      const result = await props.mutation({
        variables: {
          input: {
            menuItemId: props.menuItemId,
            name: props.name,
            extraPrice: props.extraPrice,
            isActive: "active",
          },
        },
      });

      if (result.data?.createMenuOption?.menuOption) {
        set({
          options: [...options, result.data.createMenuOption.menuOption],
        });
      }
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMenuOptionAPI: async ({ props }) => {
    try {
      set({ loading: true });
      const { options } = get();

      const result = await props.mutation({
        variables: {
          input: {
            _id: props._id,
            ...(props.name ? { name: props.name } : {}),
            ...(props.extraPrice !== undefined ? { extraPrice: props.extraPrice } : {}),
            ...(props.isActive ? { isActive: props.isActive } : {}),
          },
        },
      });

      if (result.data?.updateMenuOption?.menuOption) {
        const updated = result.data.updateMenuOption.menuOption;
        set({
          options: options.map((opt) => (opt._id === props._id ? updated : opt)),
        });
      }
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMenuOptionAPI: async ({ props }) => {
    try {
      set({ loading: true });
      const { options } = get();

      const result = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });

      if (result.data?.deleteMenuOption?._id) {
        set({
          options: options.filter((opt) => opt._id !== props._id),
        });
      }
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

