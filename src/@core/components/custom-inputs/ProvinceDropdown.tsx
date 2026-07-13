'use client'

// React Imports
import React from 'react';

// MUI Imports
import CustomAutocomplete from '@/@core/components/mui/Autocomplete';
import CustomTextField from '@/@core/components/mui/TextField';

// Type Imports
import type { ProvinceDropdownProps, ProvinceOption } from '@/types/locationTypes';

const ProvinceDropdown: React.FC<ProvinceDropdownProps> = ({
  provinceList,
  selectedProvinceId,
  onChange,
  loading = false,
  disabled = false,
  required = false,
  label = "ແຂວງ",
  fullWidth = true,
  error = false,
  placeholder,
}) => {
  // Find selected province option with proper undefined handling
  const selectedProvince = selectedProvinceId && selectedProvinceId !== '' 
    ? provinceList.find(opt => opt.id === selectedProvinceId) || null 
    : null;

  // Handle selection change
  const handleChange = (value: ProvinceOption | null) => {
    onChange(value?.id || '');
  };

  return ( 
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={provinceList}
      value={selectedProvince}
      getOptionLabel={(option) => {
        // Display Lao name primarily, fallback to English
        return option?.nameLao || option?.nameEn || '';
      }}
      onChange={(_, newValue) => handleChange(newValue)}
      renderInput={(params) => (
        <CustomTextField 
          {...params} 
          label={label || undefined}
          placeholder={loading ? 'ກໍາລັງໂຫຼດ...' : (selectedProvince ? '' : placeholder)}
          required={required}
          error={error}
        />
      )}
      loading={loading}
      disabled={disabled || loading}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      // All provinces are enabled by default
      noOptionsText={loading ? 'ກໍາລັງໂຫຼດ...' : 'ບໍ່ມີຂໍ້ມູນ'}
    />
  );
};

export default ProvinceDropdown;
