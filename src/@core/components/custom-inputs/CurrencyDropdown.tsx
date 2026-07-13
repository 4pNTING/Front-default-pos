// CurrencyDropdown.tsx
import React, { useMemo, useCallback } from 'react';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CustomTextField from '@core/components/mui/TextField';

export interface CurrencyDropdownProps {
  currencyList: any[];
  selectedCurrencyId: string;
  onChange: (currencyId: string) => void;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  placeholder?: string;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  currencyList,
  selectedCurrencyId,
  onChange,
  loading = false,
  disabled = false,
  required = false,
  label = "ສະກຸນเງິນ",
  fullWidth = true,
  error = false,
  placeholder,
}) => {
  // Find selected currency option with proper undefined handling
  const selectedCurrency = useMemo(() => 
    selectedCurrencyId && selectedCurrencyId !== '' 
      ? currencyList.find(opt => opt.id === selectedCurrencyId) || null 
      : null,
    [selectedCurrencyId, currencyList]
  );

  // Handle selection change
  const handleChange = useCallback((value: any) => {
    const newId = value?.id || '';
    onChange(newId);
  }, [onChange]);

  return ( 
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={currencyList}
      value={selectedCurrency}
      getOptionLabel={(option) => {
        // Display only currency code, no symbol
        return option?.code || option?.name || '';
      }}
      onChange={(_, newValue) => handleChange(newValue)}
      renderInput={(params) => (
        <CustomTextField 
          {...params} 
          label={label || undefined}
          placeholder={loading ? 'ກໍາລັງໂຫຼດ...' : (selectedCurrency ? '' : placeholder)}
          required={required}
          error={error}
        />
      )}
      disabled={loading || disabled}
      loading={loading}
    />
  );
};

export default CurrencyDropdown;
