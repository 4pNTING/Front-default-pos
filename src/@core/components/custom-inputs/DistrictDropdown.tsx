'use client'

// React Imports
import React from 'react';

// MUI Imports
import CustomAutocomplete from '@/@core/components/mui/Autocomplete';
import CustomTextField from '@/@core/components/mui/TextField';

// Type Imports
import type { DistrictDropdownProps, DistrictOption } from '@/types/locationTypes';

const DistrictDropdown: React.FC<DistrictDropdownProps> = ({
  districtList,
  selectedDistrictId,
  onChange,
  loading = false,
  disabled = false,
  required = false,
  label = "ເມືອງ",
  fullWidth = true,
  error = false,
  placeholder,
  dependsOnProvince = false,
}) => {
  // Find selected district option with proper undefined handling
  const selectedDistrict = selectedDistrictId && selectedDistrictId !== '' 
    ? districtList.find(opt => opt.id === selectedDistrictId) || null 
    : null;

  // Handle selection change
  const handleChange = (value: DistrictOption | null) => {
    onChange(value?.id || '');
  };

  // Determine if dropdown should be disabled
  const isDisabled = disabled || loading || (dependsOnProvince && districtList.length === 0);

  return ( 
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={districtList}
      value={selectedDistrict}
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
            (selectedDistrict ? '' : placeholder)
          }
          required={required}
          error={error}
        />
      )}
      loading={loading}
      disabled={isDisabled}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      // All districts are enabled by default
      noOptionsText={
        loading ? 'ກໍາລັງໂຫຼດ...' : 
        dependsOnProvince && districtList.length === 0 ? 'ກະລຸນາເລືອກແຂວງກ່ອນ' : 'ບໍ່ມີຂໍ້ມູນເມືອງ'
      }
    />
  );
};

export default DistrictDropdown;
