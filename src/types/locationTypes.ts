// Province Dropdown Types
export interface ProvinceOption {
  id: string;
  code: string;
  nameLao: string;
  nameEn: string;
}

export interface ProvinceDropdownProps {
  provinceList: ProvinceOption[];
  selectedProvinceId?: string;
  onChange: (provinceId: string) => void;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  placeholder?: string;
}

// District Dropdown Types  
export interface DistrictOption {
  id: string;
  code: string;
  nameLao: string;
  nameEn: string;
  provinceId: string;
}

export interface DistrictDropdownProps {
  districtList: DistrictOption[];
  selectedDistrictId?: string;
  onChange: (districtId: string) => void;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  placeholder?: string;
  dependsOnProvince?: boolean; // แสดงว่า dropdown นี้ขึ้นอยู่กับ province
}

// Village Dropdown Types
export interface VillageOption {
  id: string;
  code: string;
  nameLao: string;
  nameEn: string;
  districtId: string; 
  provinceId: string;
}

export interface VillageDropdownProps {
  villageList: VillageOption[];
  selectedVillageId?: string;
  onChange: (villageId: string) => void;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  placeholder?: string;
  dependsOnDistrict?: boolean; // แสดงว่า dropdown นี้ขึ้นอยู่กับ district
}

// Utility types for mapping
export interface LocationMappingOptions {
  displayInLao?: boolean; // true = show Lao names, false = show English names
  includeCode?: boolean; // include code in display label
}
