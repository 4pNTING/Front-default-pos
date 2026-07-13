'use client'

// React Imports
import React from 'react';

// MUI Imports
import CustomAutocomplete from '@/@core/components/mui/Autocomplete';
import CustomTextField from '@/@core/components/mui/TextField';

// Type Imports
import type { VillageDropdownProps, VillageOption } from '@/types/locationTypes';

const VillageDropdown: React.FC<VillageDropdownProps> = ({
  villageList,
  selectedVillageId,
  onChange,
  loading = false,
  disabled = false,
  required = false,
  label = "ບ້ານ",
  fullWidth = true,
  error = false,
  placeholder,
  dependsOnDistrict = false,
}) => {
  // Find selected village option with proper undefined handling
  const selectedVillage = selectedVillageId && selectedVillageId !== '' 
    ? villageList.find(opt => opt.id === selectedVillageId) || null 
    : null;

  // Handle selection change
  const handleChange = (value: VillageOption | null) => {
    onChange(value?.id || '');
  };

  // Determine if dropdown should be disabled
  const isDisabled = disabled || loading || (dependsOnDistrict && villageList.length === 0);

  return ( 
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={villageList}
      value={selectedVillage}
      getOptionLabel={(option) => {
        // Display Lao name primarily, fallback to English
        return option?.nameLao || option?.nameEn || '';
      }}
      onChange={(_, newValue) => handleChange(newValue)}
      renderInput={(params) => (
        <CustomTextField 
          {...params} 
          label={label || undefined}
          placeholder={
            loading ? 'ກໍາລັງໂຫຼດ...' : 
            (dependsOnDistrict && villageList.length === 0) ? 'ກະລຸນາເລືອກເມືອງກ່ອນ' :
            (selectedVillage ? '' : placeholder)
          }
          required={required}
          error={error}
        />
      )}
      loading={loading}
      disabled={isDisabled}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
  
      noOptionsText={
        loading ? 'ກໍາລັງໂຫຼດ...' : 
        dependsOnDistrict && villageList.length === 0 
      }
    />
  );
};

export default VillageDropdown;
