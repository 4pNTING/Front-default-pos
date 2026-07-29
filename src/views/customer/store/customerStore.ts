import { IEntityStatus, ICustomerGender, ICustomerNationality, ILeasingFileType } from "@/utils/base";
import { create } from "zustand";
import { useMutation } from "@apollo/client";
import { CreateNetworkProps, ListNetworkProps, CustomerType, CustomerInput, UpdateNetworkProps, DeleteNetworkProps, RestoreNetworkProps } from "../type/customerType";
import { MOCK_PROVINCES, MOCK_DISTRICTS, MOCK_VILLAGES, } from "@/data/mockup/locationData";
import { CREATE_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER, RESTORE_DELETE_CUSTOMER, } from "@/gql/queries/customer";
import { CREATE_ATTACHMENT } from "@/gql/queries/attachment";
import { uploadOwnerFile } from "@/utils/fileUploadService";
import { ICustomerSortField } from "@/utils/enumSortField";

export const useCustomerMutations = () => {
  const [createCustomerMutation] = useMutation(CREATE_CUSTOMER);
  const [updateCustomerMutation] = useMutation(UPDATE_CUSTOMER);
  const [deleteCustomerMutation] = useMutation(DELETE_CUSTOMER);
  const [restoreCustomerMutation] = useMutation(RESTORE_DELETE_CUSTOMER);
  const [createAttachmentMutation] = useMutation(CREATE_ATTACHMENT);

  return { createCustomerMutation, updateCustomerMutation, deleteCustomerMutation, restoreCustomerMutation, createAttachmentMutation };
};

interface IState {
  removeListenerState: () => void;
  resetModalState: () => void;

  toggleCreateComponent: boolean;
  setToggleCreateComponent: (value: boolean) => void;

  toggleUpdateComponent: boolean;
  setToggleUpdateComponent: (value: boolean) => void;

  selectedItem: CustomerType | null;
  setSelectedItem: (item: CustomerType | null) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  count: number;
  pageIndex: number;
  pageSize: number;
  isActive: string;
  selectedGender: string;
  selectedNationality: string;
  keyword: string;
  sortField: ICustomerSortField | null;
  sortOrder: 'ASC' | 'DESC' | null;

  setPagination: (pagination: {
    pageIndex: number;
    pageSize: number;
    isActive?: string;
    selectedGender?: string;
    selectedNationality?: string;
    keyword?: string;
    sortField?: ICustomerSortField | null;
    sortOrder?: 'ASC' | 'DESC' | null;
  }) => void;

  setSorting: (sortField: ICustomerSortField | null, sortOrder: 'ASC' | 'DESC' | null) => void;

  loadCustomerAPI: ({ props }: { props: ListNetworkProps }) => Promise<void>;
  searchCustomerAPI: ({ props, keyword }: { props: ListNetworkProps; keyword: string }) => Promise<void>;
  createCustomerAPI: ({ props }: { props: CreateNetworkProps }) => Promise<void>;
  updateCustomerAPI: ({ props }: { props: UpdateNetworkProps }) => Promise<void>;
  deleteCustomerAPI: ({ props }: { props: DeleteNetworkProps }) => Promise<void>;
  restoreCustomerAPI: ({ props }: { props: RestoreNetworkProps }) => Promise<void>;

  customerList: CustomerType[];

  provinceList: any[];
  districtList: any[];
  villageList: any[];
  genderList: any[];
  nationList: any[];

  loadProvinceList: () => void;
  loadDistrictList: () => void;
  loadVillageList: () => void;
  loadGenderList: () => void;
  loadNationList: () => void;
}

export const useStore = create<IState>((set, get) => ({
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
  setSelectedItem: (item: CustomerType | null) => {
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
  selectedGender: "",
  selectedNationality: "",
  keyword: "",
  sortField: null,
  sortOrder: null,

  setPagination: (pagination) => {
    set({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      isActive: pagination.isActive,
      selectedGender: pagination.selectedGender,
      selectedNationality: pagination.selectedNationality,
      keyword: pagination.keyword,
      sortField: pagination.sortField,
      sortOrder: pagination.sortOrder,
    });
  },

  setSorting: (sortField, sortOrder) => {
    set({ sortField, sortOrder });
  },

  customerList: [],
  provinceList: [],
  districtList: [],
  villageList: [],
  genderList: [],
  nationList: [],

  loadProvinceList: () => {
    set({ provinceList: MOCK_PROVINCES as any });
  },

  loadDistrictList: () => {
    set({ districtList: MOCK_DISTRICTS as any });
  },

  loadVillageList: () => {
    set({ villageList: MOCK_VILLAGES as any });
  },

  loadGenderList: () => {
    const genderOptions = [
      { _id: ICustomerGender.male, laName: 'ຊາຍ', code: ICustomerGender.male },
      { _id: ICustomerGender.female, laName: 'ຍິງ', code: ICustomerGender.female },
    ];
    set({ genderList: genderOptions });
  },

  loadNationList: () => {
    const nationalityOptions = [
      { _id: ICustomerNationality.lao, laName: 'ລາວ', code: ICustomerNationality.lao },
      { _id: ICustomerNationality.chinese, laName: 'ຈີນ', code: ICustomerNationality.chinese },
      { _id: ICustomerNationality.thai, laName: 'ໄທ', code: ICustomerNationality.thai },
      { _id: ICustomerNationality.vietnamese, laName: 'ຫວຽດນາມ', code: ICustomerNationality.vietnamese },
      { _id: ICustomerNationality.thailao, laName: 'ໄທ-ລາວ', code: ICustomerNationality.thailao },
      { _id: ICustomerNationality.korea, laName: 'ເກົາຫຼີ', code: ICustomerNationality.korea },
      { _id: ICustomerNationality.none, laName: 'ອື່ນໆ', code: ICustomerNationality.none },
    ];
    set({ nationList: nationalityOptions });
  },

  loadCustomerAPI: async ({ props }: { props: ListNetworkProps }) => {
    try {
      set({ loading: true });

      const state = get();
      const { selectedGender, selectedNationality } = state;
      const page = props.page || (props.pageIndex !== undefined ? props.pageIndex + 1 : state.pageIndex + 1);
      const limit = props.limit || props.pageSize || state.pageSize;
      const isActive = props.isActive || state.isActive;
      const keyword = props.keyword !== undefined ? props.keyword : state.keyword;
      const sortField = props.sortField || state.sortField;
      const sortDirection = props.sortDirection || state.sortOrder;

      const variables: { input: CustomerInput } = {
        input: {
          page,
          limit,
        },
      };

      if (sortField) {
        variables.input.sortField = sortField;
      }
      if (sortDirection) {
        variables.input.sortDirection = sortDirection;
      }

      if (isActive && isActive !== IEntityStatus.all) {
        variables.input.isActive = isActive;
      }

      if (keyword && keyword.trim() !== '') {
        variables.input.keyword = keyword.trim();
      }

      const result = await props.query({
        variables,
      });


      if (result.data?.loadCustomer) {
        let customers = result.data.loadCustomer.customer || [];

        if (selectedGender) {
          customers = customers.filter((c: any) => c.gender === selectedGender);
        }

        if (selectedNationality) {
          customers = customers.filter((c: any) => c.nationality === selectedNationality);
        }

        const totalCount = result.data.loadCustomer.count || 0;

        set(() => ({
          customerList: customers,
          count: totalCount,
        }));
      } else {
        set(() => ({
          customerList: [],
          count: 0,
        }));
      }
    } catch (error: any) {
      set(() => ({ customerList: [], count: 0 }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  searchCustomerAPI: async ({ props, keyword }) => {
    try {
      set({
        keyword: keyword,
        pageIndex: 0
      });
      await get().loadCustomerAPI({ props });
    } catch (error: any) {
      throw error;
    }
  },

  createCustomerAPI: async ({ props }: { props: CreateNetworkProps }) => {
    try {
      set({ loading: true });


      const { customerList, count } = get();
      let fileUrl: string | undefined | null = undefined;
      const customerFile = props.customerFile;
      if (customerFile) {
        if (customerFile.file) {
          const ownerId = `temp-${Date.now()}`;
          const uploadedUrl = await uploadOwnerFile({
            file: customerFile.file,
            ownerId,
            ownerType: ILeasingFileType.mmsCustomer,
            dic: props.dictionary,
          });
          if (!uploadedUrl) {
            throw new Error(props.dictionary?.uploadFileFailedCannotSave || props.dictionary?.uploadError);
          }
          fileUrl = uploadedUrl;
        } else if (customerFile.url) {
          fileUrl = customerFile.url;
        }
      }

      const input: CustomerInput = {
        firstName: props.firstName,
        lastName: props.lastName,
        phoneNumber: props.phoneNumber,
        gender: props.gender,
        nationality: props.nationality,
        province: props.province,
        district: props.district,
        village: props.village,
        fileUrl: fileUrl,
      };

      if (props.contact) {
        const contact = props.contact;
        input.contact = {
          firstName: contact.firstName,
          lastName: contact.lastName,
          phoneNumber: contact.phoneNumber,
          province: contact.province,
          district: contact.district,
          village: contact.village,
        };
      }

      const { data } = await props.mutation({
        variables: { input },
      });

      if (data?.createCustomer?.customer) {
        const createdCust = data.createCustomer.customer;
        if (fileUrl && props.createAttachmentMutation) {
          try {
            await props.createAttachmentMutation({
              variables: {
                input: {
                  ownerId: createdCust._id,
                  ownerType: 'customer',
                  originalName: customerFile?.name || 'customer_file',
                  fileUrl: fileUrl,
                  fileSize: customerFile?.size,
                  mimeType: customerFile?.type,
                  uploadType: customerFile?.type?.includes('image') ? 'image' : 'pdf',
                  status: 'completed'
                }
              }
            });
          } catch (attErr) {
            console.warn('Failed to record attachment metadata:', attErr);
          }
        }
        set(() => ({
          customerList: [createdCust, ...customerList],
          count: count + 1,
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCustomerAPI: async ({ props }: { props: UpdateNetworkProps }) => {
    try {
      set({ loading: true });

      const { customerList } = get();

      let fileUrl: string | undefined | null = undefined;
      const customerFile = props.customerFile;

      if (customerFile) {
        if (customerFile.file) {
          const ownerId = props._id;
          const uploadedUrl = await uploadOwnerFile({
            file: customerFile.file,
            ownerId,
            ownerType: ILeasingFileType.mmsCustomer,
            dic: props.dictionary,
          });
          if (!uploadedUrl) {
            throw new Error(props.dictionary?.uploadFileFailedCannotSave || props.dictionary?.uploadError );
          }
          fileUrl = uploadedUrl;
        } else if (customerFile.url) {
          fileUrl = customerFile.url;
        } else {
          fileUrl = null;
        }
      } else if (customerFile === null) {
        fileUrl = null;
      }

      const input: CustomerInput = {
        _id: props._id,
        firstName: props.firstName,
        lastName: props.lastName,
        phoneNumber: props.phoneNumber,
        gender: props.gender,
        nationality: props.nationality,
        province: props.province,
        district: props.district,
        village: props.village,
      };

      if (typeof fileUrl !== "undefined") {
        input.fileUrl = fileUrl;
      }
      if (typeof props.deleteContact !== "undefined") {
        input.deleteContact = props.deleteContact;
      }
      if (props.contact) {
        const contact = props.contact;
        input.contact = {
          firstName: contact.firstName,
          lastName: contact.lastName,
          phoneNumber: contact.phoneNumber,
          province: contact.province,
          district: contact.district,
          village: contact.village,
        };
      }

      const { data } = await props.mutation({
        variables: { input },
      });

      if (data?.updateCustomer?.customer) {
        const updatedCust = data.updateCustomer.customer;
        if (fileUrl && props.createAttachmentMutation) {
          try {
            await props.createAttachmentMutation({
              variables: {
                input: {
                  ownerId: updatedCust._id,
                  ownerType: 'customer',
                  originalName: customerFile?.name || 'customer_file',
                  fileUrl: fileUrl,
                  fileSize: customerFile?.size,
                  mimeType: customerFile?.type,
                  uploadType: customerFile?.type?.includes('image') ? 'image' : 'pdf',
                  status: 'completed'
                }
              }
            });
          } catch (attErr) {
            console.warn('Failed to record attachment metadata:', attErr);
          }
        }
        set((state) => ({
          selectedItem: updatedCust,
          customerList: state.customerList.map((item) =>
            item._id === props._id ? updatedCust : item
          ),
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteCustomerAPI: async ({ props }: { props: DeleteNetworkProps }) => {
    try {
      set({ loading: true });

      const { customerList, count } = get();

      const { data } = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });

      if (data?.deleteCustomer?.customer) {
        set(() => ({
          customerList: customerList.filter((item) => item._id !== props._id),
          count: count - 1,
        }));
      }
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  restoreCustomerAPI: async ({ props }: { props: RestoreNetworkProps }) => {
    try {
      set({ loading: true });

      const { customerList, count, isActive } = get();

      const { data } = await props.mutation({
        variables: {
          input: {
            _id: props._id,
          },
        },
      });

      if (data?.restoreDeleteCustomer?.customer) {
        if (isActive === IEntityStatus.inactive) {
          set(() => ({
            customerList: customerList.filter((item) => item._id !== props._id),
            count: count - 1,
          }));
        } else if (isActive === IEntityStatus.all) {
          set(() => ({
            customerList: customerList.map((item) =>
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