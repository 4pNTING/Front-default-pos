import { Breadcrumbs, Button } from "@mui/material";
import Link from "next/link";
import { CategoryListProps } from "../../type/categoryType";
import { useCategoryStore } from "../../store/categoryStore";
import { useEffect, useState, useRef, useCallback } from "react";
import { ToastService } from "@/utils/toastService";
import { IEntityStatus } from "@/utils/base";
import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import CustomTextField from "@/@core/components/mui/TextField";

const HeaderComponent = ({
  props,
  globalFilter,
  setGlobalFilter,
  onGlobalFilterChange,
  loadCategoryCall,
}: {
  props: CategoryListProps;
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onGlobalFilterChange?: (value: string) => void;
  loadCategoryCall: any;
}) => {
  const { lang, dictionary: dic } = props;

  const {
    loading,
    setPagination,
    loadCategoryAPI,
    pageIndex,
    pageSize,
    keyword,
    isActive,
    setToggleCreateComponent,
  } = useCategoryStore();

  async function onSelectStatus(value: string) {
    try {
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
        keyword: keyword,
        isActive: value,
        sortField: null,
        sortOrder: null,
      });

      await loadCategoryAPI({
        props: {
          query: loadCategoryCall,
          dictionary: dic,
        },
      });
    } catch (error: any) {
      ToastService.error(error.message);
    }
  }

  function openCreateComponent() {
    setToggleCreateComponent(true);
  }

  return (
    <>
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
                  {dic.pageBreadcrumbs?.homePage}
                </Link>

                <Link
                  className="text-[#41669D] hover:underline hover:underline-offset-1 font-bold"
                  href="/category"
                >
                  {dic.pageBreadcrumbs?.categoryPage || dic?.category}
                </Link>
              </Breadcrumbs>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex items-start justify-between gap-4 mt-6">
            {/* Left: Filter and Search */}
            <div className="flex items-center gap-3 flex-1">
              {/* Status Filter */}
              <div className="w-[200px]">
                <CustomAutocomplete
                  sx={{ width: "100%" }}
                  options={[
                    { label: dic["active"], value: IEntityStatus.active },
                    { label: dic["inactive"], value: IEntityStatus.inactive },
                  ]}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
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
                    onSelectStatus(value?.value || IEntityStatus.all);
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

              {/* Search Input */}
              <div className="flex-1 max-w-[400px]">
                <CustomTextField
                  sx={{ maxWidth: 300, width: 300 }}
                  type="search"
                  placeholder={dic.placeHolder?.search}
                  value={globalFilter ?? ""}
                  onChange={(e) =>
                    onGlobalFilterChange
                      ? onGlobalFilterChange(e.target.value)
                      : setGlobalFilter?.(e.target.value)
                  }
                  inputProps={{ autoComplete: "off" }}
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
                {dic?.createCategory}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;

