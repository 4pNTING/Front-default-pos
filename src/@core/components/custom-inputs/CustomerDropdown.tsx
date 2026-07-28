// CustomerDropdown.tsx
import React, { useMemo } from 'react';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CustomTextField from '@core/components/mui/TextField';
import type { Customer } from '@/gql/models/graphql';

export interface CustomerDropdownProps {
  selectedCustomerId: string;
  selectedCustomer?: Customer | null;
  onChange: (customer: Customer | null) => void;
  customers?: Customer[]; // ✅ รับ data จาก props
  loading?: boolean; // ✅ รับ loading state จาก props
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  dic?: any;
  sx?: object; // Added sx prop for custom styling
}

const CustomerDropdown: React.FC<CustomerDropdownProps> = ({
  selectedCustomerId,
  selectedCustomer,
  onChange,
  customers = [], // ✅ รับจาก props
  loading = false, // ✅ รับจาก props
  disabled = false,
  required = true,
  label = "ລູກຄ້າ",
  fullWidth = true,
  error = false,
  helperText,
  placeholder,
  dic,
  sx, // Added sx prop
}) => {


  // ✅ Use customers directly (GraphQL CustomerType)
  const items = useMemo((): Customer[] => {
    if (!Array.isArray(customers) || customers.length === 0) {
      return [];
    }
    return customers;
  }, [customers]);

  const displayCustomer = useMemo(
    () => selectedCustomer || items.find(option => option._id === selectedCustomerId) || null,
    [selectedCustomer, selectedCustomerId, items]
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium  ">
          {label}
          {required && <span className="text-red-500 ml-1"></span>}
        </label>
      )}
      <CustomAutocomplete
        fullWidth={fullWidth}
        options={items}
        value={displayCustomer}
        multiple={false}
        getOptionLabel={(option) => {
          const firstName = option?.firstName || '';
          const lastName = option?.lastName || '';
          const name = `${firstName} ${lastName}`.trim();
          return name || 'No Name';
        }}
        isOptionEqualToValue={(option, value) => {
          return option?._id === value?._id;
        }}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <CustomTextField 
            {...params} 
            required={false}
            error={error}
            placeholder={placeholder}
            sx={{
              '& .MuiAutocomplete-input': {
                fontSize: '14px',
              },
              ...sx, // Merge with passed sx prop
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props as any;
          return (
            <li key={key} {...otherProps} className="px-3 py-2 hover:bg-gray-50">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm ">
                    {`${option?.firstName || ''} ${option?.lastName || ''}`.trim() || 'No Name'}
                  </span>
                </div>
         
              </div>
            </li>
          );
        }}
        disabled={loading || disabled}
        loading={loading}
      />
    </div>
  );
};

export default CustomerDropdown;
