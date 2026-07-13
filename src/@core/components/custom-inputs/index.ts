// Custom Input Components Export
export { default as CustomerDropdown } from './CustomerDropdown';
export { default as DocumentTypeDropdown } from './DocumentTypeDropdown';
export { default as ShopCategoryDropdown } from './ShopCategoryDropdown';
export { default as RoomStatusDropdown } from './RoomStatusDropdown';
export { default as CurrencyDropdown } from './CurrencyDropdown';
export { default as RoomDropdown } from './RoomDropdown';
export { default as ProvinceDropdown } from './ProvinceDropdown';
export { default as DistrictDropdown } from './DistrictDropdown';
export { default as VillageDropdown } from './VillageDropdown';
export { default as Attachment } from './Attachment';
export { default as UploadFile } from './UploadFile';

// Export component prop types
export type { CustomerDropdownProps } from './CustomerDropdown';
export type { DocumentTypeDropdownProps } from './DocumentTypeDropdown';
export type { ShopCategoryDropdownProps } from './ShopCategoryDropdown';
export type { RoomStatusDropdownProps } from './RoomStatusDropdown';
export type { CurrencyDropdownProps } from './CurrencyDropdown';
export type { RoomDropdownProps } from './RoomDropdown';
export type { AttachmentProps, AttachedFile } from './Attachment';
export type { UploadFileProps } from './UploadFile';

// Location dropdown prop types
export type { 
  ProvinceDropdownProps, 
  DistrictDropdownProps, 
  VillageDropdownProps,
  ProvinceOption,
  DistrictOption,
  VillageOption,
} from '@/types/locationTypes';

// Re-export existing types
export * from './types';

// Re-export existing components
export { default as CustomInputHorizontal } from './Horizontal';
export { default as CustomInputVertical } from './Vertical';
export { default as CustomInputImg } from './Image';
