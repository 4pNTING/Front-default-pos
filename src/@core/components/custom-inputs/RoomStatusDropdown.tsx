// RoomStatusDropdown.tsx

import React, { useMemo, useCallback } from 'react';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CustomTextField from '@core/components/mui/TextField';

// Simple type for dropdown options
interface RoomStatusOption {
  id: string;
  name: string;
}

export interface RoomStatusDropdownProps {
  selected: string;
  onRoomStatusChange: (roomStatusId: string) => void;
  roomStatuses?: any[]; // ✅ รับ data จาก props
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  dic?: any;
}

const RoomStatusDropdown: React.FC<RoomStatusDropdownProps> = ({
  selected,
  onRoomStatusChange,
  roomStatuses = [], // ✅ รับจาก props
  loading = false,
  disabled = false,
  required = false,
  label = "ສະຖານະຫ້ອງ",
  fullWidth = true,
  error = false,
  helperText = "",
  placeholder,
  dic
}) => {

  const roomStatusOptions = useMemo((): RoomStatusOption[] => {
    if (!Array.isArray(roomStatuses)) {
      return [];
    }
    return roomStatuses.map(status => ({
      id: status._id || status.id,
      name: status.name
    } as RoomStatusOption));
  }, [roomStatuses]);

  const selectedOption = useMemo(() => 
    roomStatusOptions.find(option => option.id === selected) || null,
    [selected, roomStatusOptions]
  );
  
  const isDisabled = disabled || loading;

  const handleRoomStatusChange = useCallback((event: any, newValue: RoomStatusOption | null) => {
    onRoomStatusChange(newValue?.id || '');
  }, [onRoomStatusChange]);

  return (
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={roomStatusOptions}
      value={selectedOption}
      getOptionLabel={(option) => option?.name || ''}
      onChange={handleRoomStatusChange}
      renderInput={(params) => (
        <CustomTextField 
          {...params} 
          label={loading ? "ກຳລັງໂຫຼດ..." : label}
          placeholder={placeholder || dic?.selectRoomStatus}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
      disabled={isDisabled}
      loading={loading}
      noOptionsText={loading ? "ກຳລັງໂຫຼດ..." : "ບໍ່ພົບສະຖານະຫ້ອງ"}
      loadingText="ກຳລັງໂຫຼດ..."
    />
  );
};

export default RoomStatusDropdown;