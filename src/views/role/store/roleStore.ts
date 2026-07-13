import { graphErrorHelper } from '@/utils/getErrorMessage';
import { create } from 'zustand';
import { toast } from 'react-toastify';
import { FilterModel } from '@/types/filterTypes';
// 🛑 FIX: REMOVE problematic import and DEFINE a temporary type (Role)
// import { Role } from '@/gql/models/graphql'; 
import { RoleNetworkProps } from '../type/roleTypes';
import { roleStatic } from './roleStaticStore';

// ====================================================================================
// === TEMPORARY ROLE TYPE (to resolve ts(2305) error) ===
// This definition includes the structure needed by consuming components and the store itself.
interface TempRole {
    // Properties necessary for the store and consuming components (like tables/menus)
    _id?: string;
    laName?: string | null;
    enName?: string | null;
    systemCode?: string | null;
    menus: Array<any>; // Used to check length/structure in components
    [key: string]: any; // Allows any other properties to be present without error
}

type Role = TempRole;
// === END TEMPORARY ROLE TYPE ===
// ====================================================================================

interface RoleState {
    loading: boolean;
    role: Role | null;
    roles: Role[];
    toUpdate: Role | null;
    filter: Partial<FilterModel> | null;
    //
    setToUpdate: (role: Role | null) => void;
    onFilterChange: ({
        filter,
        props,
    }: {
        filter: FilterModel | null;
        props: RoleNetworkProps;
    }) => void;
    queryRoles: ({ props }: { props: RoleNetworkProps }) => void;
    queryRoleById: ({
        props,
        id,
    }: {
        props: RoleNetworkProps;
        id: string;
    }) => void;
}

// Create the Zustand store with the defined type
export const useRoleStore = create<RoleState>((set, get) => ({
    loading: false, // FIX: Changed from true to false
    role: null,
    roles: [],
    toUpdate: null,
    filter: null,
    //
    setToUpdate: (role: Role | null) => {
        set({ toUpdate: role });
    },
    onFilterChange: ({
        filter,
        props,
    }: {
        filter: FilterModel | null;
        props: RoleNetworkProps;
    }) => {
        set(() => ({ filter: filter }));
        get().queryRoles({ props: props });
    },
    queryRoles: async ({ props }: { props: RoleNetworkProps }) => {
        try {
            set({ loading: true });
            if (props?.queryRoles === undefined)
                return toast.error(props.dictionary.missingGqlHook);
            const { data, error } = await props?.queryRoles({
                variables: {
                    queryInput: props?.filter ?? get().filter,
                },
            });

            if (data) {
                // Cast Roles result to Role[] (TempRole[])
                const roles: Role[] = data?.Roles as Role[] ?? [];
                console.log(roles);

                set(() => ({ roles: roles }));
            } else {
                toast.error(graphErrorHelper(error));
            }
        } catch (e) {
            toast.error(graphErrorHelper(e));
        } finally {
            set({ loading: false });
        }
    },
    queryRoleById: async ({
        props,
        id,
    }: {
        props: RoleNetworkProps;
        id: string;
    }) => {
        try {
            set({ loading: true });
            if (props?.queryRoles === undefined)
                return toast.error(props.dictionary.missingGqlHook);
            // const { data, error } = await props?.queryRoles({
            //     variables: {
            //         roleId: id,
            //     }
            // });

            const data = roleStatic?.data as any;
            const error = {} as any;

            if (data) {
                // Cast Role result to Role (TempRole)
                const role: Role = data?.Role as Role ?? null;
                set(() => ({ role: role }));
            } else {
                set(() => ({ role: null }));
                toast.error(graphErrorHelper(error));
            }
        } catch (e) {
            set(() => ({ role: null }));
            toast.error(graphErrorHelper(e));
        } finally {
            set({ loading: false });
        }
    },
}));