"use client";
import { Breadcrumbs, Button } from "@mui/material";
import Link from "next/link";
import { MenuItemListProps } from "../../type/menuItemType";
import { useMenuItemStore } from "../../store/menuItemStore";
import { IEntityStatus } from "@/utils/base";
import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import CustomTextField from "@/@core/components/mui/TextField";

const HeaderComponent = ({
  props,
  searchValue,
  onSearch,
  onCategoryChange,
  onStatusChange,
}: {
  props: MenuItemListProps;
  searchValue: string;
  onSearch: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onStatusChange: (status: string) => void;
}) => {
  const { dictionary: dic } = props;
  const labels = dic.menuItemPage;

  const {
    loading,
    setToggleCreateComponent,
    selectedCategory,
    categoryList,
    isActive,
  } = useMenuItemStore();

  const openCreateComponent = () => {
    setToggleCreateComponent(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        {/* Title */}
        <div className="grid md:grid-cols-2">
          <div className="flex gap-2 flex-col">
            <Breadcrumbs
              separator={<span style={{ margin: "0 8px" }}>›</span>}
              aria-label="breadcrumb"
            >
              <Link
                className="text-[#333] hover:underline hover:underline-offset-1"
                href="/"
              >
                {dic.pageBreadcrumbs.homePage}
              </Link>

              <Link
                className="text-[#41669D] hover:underline hover:underline-offset-1 font-bold"
                href="/menuitem"
              >
                {labels.title}
              </Link>
            </Breadcrumbs>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-start justify-between gap-4 mt-6 flex-wrap lg:flex-nowrap">
          {/* Left: Filter and Search */}
          <div className="flex items-center gap-3 flex-1 flex-wrap sm:flex-nowrap">
            {/* Status Filter */}
            <div className="w-full sm:w-[180px]">
              <CustomAutocomplete
                sx={{ width: "100%" }}
                options={[
                  { label: dic["all"], value: IEntityStatus.all },
                  { label: dic["active"], value: IEntityStatus.active },
                  { label: dic["inactive"], value: IEntityStatus.inactive },
                ]}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder={dic.status}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <i className="tabler-filter text-[16px] mr-2" />
                      ),
                    }}
                  />
                )}
                onChange={(_, value) => {
                  onStatusChange(value?.value ?? IEntityStatus.all);
                }}
                value={
                  isActive === IEntityStatus.active
                    ? { label: dic["active"], value: IEntityStatus.active }
                    : isActive === IEntityStatus.inactive
                    ? { label: dic["inactive"], value: IEntityStatus.inactive }
                    : { label: dic["all"], value: IEntityStatus.all }
                }
                size="small"
                loading={loading}
                disabled={loading}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-[200px]">
              <CustomAutocomplete
                sx={{ width: "100%" }}
                options={[
                  { label: labels.allCategories, value: "" },
                  ...categoryList.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                  })),
                ]}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder={labels.category}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <i className="tabler-category text-[16px] mr-2 text-gray-500" />
                      ),
                    }}
                  />
                )}
                onChange={(_, value) => {
                  onCategoryChange(value?.value ?? "");
                }}
                value={
                  selectedCategory
                    ? {
                        label:
                          categoryList.find((c) => c._id === selectedCategory)?.name ??
                          selectedCategory,
                        value: selectedCategory,
                      }
                    : {
                        label: labels.allCategories,
                        value: "",
                      }
                }
                size="small"
                loading={loading}
                disabled={loading}
              />
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-[280px]">
              <CustomTextField
                fullWidth
                type="search"
                placeholder={labels.searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                inputProps={{ autoComplete: "off" }}
                InputProps={{
                  startAdornment: (
                    <i className="tabler-search text-[16px] mr-2 text-gray-500" />
                  ),
                }}
              />
            </div>
          </div>

          {/* Right: Create Button */}
          <div>
            <Button
              disabled={loading}
              size="medium"
              onClick={openCreateComponent}
              variant="contained"
              sx={{
                backgroundColor: "#0A3981",
                minWidth: 150,
                "&:hover": { backgroundColor: "#082d5c" },
              }}
              startIcon={<i className="tabler-circle-plus text-[20px]"></i>}
            >
              {labels.create}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
