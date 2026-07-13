// RoomDropdown.tsx - Props-based Room Selection Component
import React, { useEffect, useState } from 'react';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CustomTextField from '@core/components/mui/TextField';
import type { RoomAreaType } from '@/gql/models/graphql';

export interface RoomDropdownProps {
  selectedItem: string;
  onChange: (roomId: string) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  excludeRoomIds?: string[];
  options?: RoomAreaType[];
}

const RoomDropdown: React.FC<RoomDropdownProps> = ({
  selectedItem,
  onChange,
  disabled = false,
  required = false,
  label = "ເລືອກຫ້ອງ",
  placeholder,
  fullWidth = true,
  error = false,
  helperText = "",
  excludeRoomIds = [],
  options = []
}) => {
  const [filteredRooms, setFilteredRooms] = useState<RoomAreaType[]>([]);
  


  // Filter available rooms (exclude already selected rooms)
  useEffect(() => {
    const available = options.filter(room => 
      !excludeRoomIds.includes(room._id || '')
    );

    setFilteredRooms(available);
  }, [options, excludeRoomIds]);

  // Find selected room option
  const selectedRoom = filteredRooms.find(room => room._id === selectedItem) || null;

  // Handle selection change
  const handleChange = (value: RoomAreaType | null) => {
    onChange(value?._id || '');
  };

  return (
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={filteredRooms}
      getOptionLabel={(option: RoomAreaType) => option.name || ''}
      getOptionKey={(option: RoomAreaType) => option._id || `room-${option.uniqueId || Math.random()}`}
      isOptionEqualToValue={(option: RoomAreaType, value: RoomAreaType) => 
        option._id === value._id
      }
      value={selectedRoom}
      onChange={(_, value) => handleChange(value)}
      disabled={disabled || filteredRooms.length === 0}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          placeholder={placeholder}
          required={required}
          error={error}
          // helperText={helperText || (filteredRooms.length === 0 ? 'ບໍ່ມີຫ້ອງວ່າງ' : '')}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props as any;
        return (
          <li key={key} {...otherProps} className="px-3 py-2 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <i className="tabler-door text-blue-600" style={{ fontSize: '16px' }}></i>
              <span className="font-medium text-xs">{option.name || 'No Name'}</span>
            </div>
          </li>
        );
      }}
    />
  );
};

export default RoomDropdown;
