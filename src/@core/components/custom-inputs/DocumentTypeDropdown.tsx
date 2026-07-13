// DocumentTypeDropdown.tsx
import React, { useMemo, useCallback } from 'react';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CustomTextField from '@core/components/mui/TextField';

// Simple type for dropdown options
interface DocumentTypeOption {
  id: string;
  name: string;
}

export interface DocumentTypeDropdownProps {
  selectedDocumentTypeId: string;
  onDocumentTypeChange: (documentTypeId: string) => void;
  documentTypes?: any[]; // ✅ รับ data จาก props
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

const DocumentTypeDropdown: React.FC<DocumentTypeDropdownProps> = ({
  selectedDocumentTypeId,
  onDocumentTypeChange,
  documentTypes = [], // ✅ รับจาก props
  loading = false,
  disabled = false,
  required = false,
  label = "ປະເພດເອກະສານ",
  fullWidth = true,
  error = false,
  helperText = "",
  placeholder,
  dic
}) => {

  const documentTypeOptions = useMemo((): DocumentTypeOption[] => {
    if (!Array.isArray(documentTypes)) {
      return [];
    }
    return documentTypes.map(doc => ({
      id: doc.id,
      name: doc.name
    } as DocumentTypeOption));
  }, [documentTypes]);

  const selectedOption = useMemo(() => 
    documentTypeOptions.find(option => option.id === selectedDocumentTypeId) || null,
    [selectedDocumentTypeId, documentTypeOptions]
  );
  
  const isDisabled = disabled || loading;

  const handleDocumentTypeChange = useCallback((event: any, newValue: DocumentTypeOption | null) => {
    onDocumentTypeChange(newValue?.id || '');
  }, [onDocumentTypeChange]);

  return (
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={documentTypeOptions}
      value={selectedOption}
      getOptionLabel={(option) => option?.name || ''}
      onChange={handleDocumentTypeChange}
      renderInput={(params) => (
        <CustomTextField 
          {...params} 
          label={loading ? "ກຳລັງໂຫຼດ..." : label} 
          placeholder={placeholder || dic?.selectDocumentType}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
      disabled={isDisabled}
      loading={loading}
      noOptionsText={loading ? "ກຳລັງໂຫຼດ..." : "ບໍ່ພົບປະເພດເອກະສານ"}
      loadingText="ກຳລັງໂຫຼດ..."
    />
  );
};

export default DocumentTypeDropdown;