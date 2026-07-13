// 6. views/zone/list/components/header.component.tsx
import { Breadcrumbs, Button, Typography } from "@mui/material";
import Link from "next/link";
import { ZoneListProps } from "../../type/zoneType";
import { useStore } from "../../store/zoneStore";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import { IEntityStatus, IRoleConfigLevel } from "@/utils/base";
import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import CustomTextField from "@/@core/components/mui/TextField";

const HeaderComponent = ({
  props,
  loadZoneCall,
}: {
  props: ZoneListProps;
  loadZoneCall: any;
}) => {
  // Var
  const { lang, dictionary: dic } = props;

  // Hooks
  const {
    loading,
    setPagination,
    loadZoneAPI,
    pageIndex,
    pageSize,
    search,
    isActive,
    setLoading,
    toggleCreateComponent,
    setToggleCreateComponent,
  } = useStore();

  // Handle search with debounce
  useEffect(() => {
    // ถ้า clear search ให้ load ทันที
    if (!search || search.length === 0) {
      onSearch();
      return;
    }

    // รอ 500ms ก่อน search (debounce)
    const timer = setTimeout(() => {
      onSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // funcs
  async function onSearch() {
    try {
      await loadZoneAPI({
        props: {
          query: loadZoneCall,
          dictionary: dic,
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  function onSearchChange(value: string) {
    setPagination({
      pageIndex: 0,
      pageSize: pageSize,
      search: value,
      isActive: isActive,
    });
  }

  async function onSelectStatus(value: string) {
    try {
      // Set pagination in store
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
        search: search,
        isActive: value,
      });


      // Pass parameters directly to loadZoneAPI
      await loadZoneAPI({
        props: {
          query: loadZoneCall,
          dictionary: dic,
        },
        params: {
          pageIndex: 0,
          pageSize: pageSize,
          isActive: value,
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  function openCreateComponent() {
    setToggleCreateComponent(true);
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-5">
          {/* title */}
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
                  href="/zone"
                >
                  {dic.zone}
                </Link>
              </Breadcrumbs>
            </div>
          </div>
          {/* end title */}

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
                  placeholder={dic.placeHolder?.search}
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-search text-[16px] mr-2 text-gray-500" />
                    ),
                  }}
                  inputProps={{ autoComplete: "off" }}
                  size="small"
                  fullWidth
                  disabled={loading}
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
                {dic?.createZone}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;
