// ShopCategoryDropdown.tsx
import React, { useMemo } from "react";
import CustomAutocomplete from "@core/components/mui/Autocomplete";
import CustomTextField from "@core/components/mui/TextField";
import { ShopCategoryType } from "@/gql/models/graphql";

// Simple type for dropdown options
interface ShopCategoryOption {
  id: string;
  name: string;
}

export interface ShopCategoryDropdownProps {
  selectedShopCategoryId: string;
  onShopCategoryChange: (shopCategoryId: string) => void;
  shopCategories?: any[]; // ✅ รับ data จาก props
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  size?: "small" | "medium";
  dic?: any;
}

const ShopCategoryDropdown: React.FC<ShopCategoryDropdownProps> = ({
  selectedShopCategoryId,
  onShopCategoryChange,
  shopCategories = [], // ✅ รับจาก props
  loading = false,
  disabled = false,
  required = false,
  label = "ປະເພດຮ້ານຄ້າ",
  fullWidth = true,
  error = false,
  helperText = "",
  placeholder,
  size = "small", // Default to small to match other inputs
  dic,
}) => {
  const shopCategoryOptions = useMemo((): ShopCategoryOption[] => {
    if (!Array.isArray(shopCategories) || shopCategories.length === 0) {
      return [];
    }

    return shopCategories.map((shopCategory, index) => {
      const label =
        shopCategory.name ||
        shopCategory.categoryName ||
        shopCategory.displayName ||
        "Unknown Category";
      const originalId = shopCategory._id || shopCategory.id;

      const id =
        originalId && String(originalId).trim() !== ""
          ? String(originalId)
          : `shop-category-${index}-${Date.now()}`;

      return {
        id: id,
        name: label,
      } as ShopCategoryOption;
    });
  }, [shopCategories]);

  const selectedShopCategory = useMemo(
    () =>
      shopCategoryOptions.find(
        (option) => option.id === selectedShopCategoryId,
      ) || null,
    [selectedShopCategoryId, shopCategoryOptions],
  );

  return (
    <CustomAutocomplete
      fullWidth={fullWidth}
      options={shopCategoryOptions}
      value={selectedShopCategory}
      multiple={false}
      getOptionLabel={(option) => option?.name || ""}
      onChange={(_, newValue) => onShopCategoryChange(newValue?.id || "")}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          placeholder={placeholder || dic?.shopCategory?.placeholder}
          autoComplete="off"
          InputProps={{
            ...params.InputProps,
            sx: {
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#575757ff !important",
              },
            },
          }}
          sx={{
            "& .MuiInputLabel-root.Mui-disabled": {
              color: "#575757ff !important",
            },
          }}
        />
      )}
      disabled={loading || disabled}
      loading={loading}
      size={size}
    />
  );
};

export default ShopCategoryDropdown;
