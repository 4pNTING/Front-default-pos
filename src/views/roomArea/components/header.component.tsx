import { Breadcrumbs, Button } from "@mui/material";
import Link from "next/link";
import { RoomAreaListProps } from "../type/roomAreaType";
import { useStore } from "../store/roomAreaStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import CustomTextField from "@/@core/components/mui/TextField";
import { IEntityStatus } from "@/utils/base";

interface HeaderComponentProps {
  props: RoomAreaListProps;
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  onGlobalFilterChange?: (value: string) => void;
  loadRoomAreaCall: any;
  loadZoneCall: any;
  loadCategoryCall: any;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  props,
  globalFilter,
  setGlobalFilter,
  onGlobalFilterChange,
  loadRoomAreaCall,
  loadZoneCall,
  loadCategoryCall,
}) => {
  // Var
  const { lang, dictionary: dic } = props;

  // Hooks
  const {
    loading,
    setPagination,
    loadRoomAreaAPI,
    pageIndex,
    pageSize,
    isActive,
    selectedZoneId,
    selectedCategoryId,
    zoneList,
    categoryList,
    setZoneList,
    setCategoryList,
    setToggleCreateComponent,
  } = useStore();

  // Load zones and categories on component mount (only if not already loaded)
  useEffect(() => {
    // Skip if data already exists in store
    if (zoneList.length === 0) {
      loadZones();
    }
    if (categoryList.length === 0) {
      loadCategories();
    }
  }, []);

  async function loadZones() {
    try {
      const result = await loadZoneCall({
        variables: {
          input: {
            page: 1,
            limit: 500,
            isActive: IEntityStatus.active,
          },
        },
      });

      if (result.data?.loadZone) {
        const zones = result.data.loadZone.zone || [];
        setZoneList(zones);
      }
    } catch (error: any) {
      console.error("Error loading zones:", error);
      setZoneList([]);
    }
  }

  async function loadCategories() {
    try {
      const result = await loadCategoryCall({
        variables: {
          input: {
            page: 1,
            limit: 500,
            isActive: IEntityStatus.active,
          },
        },
      });

      if (result.data?.loadRoomAreaCategory) {
        const categories =
          result.data.loadRoomAreaCategory.roomAreaCategory || [];
        setCategoryList(categories);
      }
    } catch (error: any) {
      console.error("Error loading categories:", error);
      setCategoryList([]);
    }
  }

  // Filter functions
  async function onSelectZone(zoneId: string) {
    try {
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
        isActive: isActive,
        zoneId: zoneId,
        categoryId: selectedCategoryId,
      });

      await loadRoomAreaAPI({
        props: {
          query: loadRoomAreaCall,
          dictionary: dic,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function onSelectCategory(categoryId: string) {
    try {
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
        isActive: isActive,
        zoneId: selectedZoneId,
        categoryId: categoryId,
      });

      await loadRoomAreaAPI({
        props: {
          query: loadRoomAreaCall,
          dictionary: dic,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function onSelectStatus(status: string) {
    try {
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
        isActive: status,
        zoneId: selectedZoneId,
        categoryId: selectedCategoryId,
      });

      await loadRoomAreaAPI({
        props: {
          query: loadRoomAreaCall,
          dictionary: dic,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        {/* Breadcrumbs */}
        <div className="mb-3">
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
              href="/roomArea"
            >
              {dic.pageBreadcrumbs?.roomPage}
            </Link>
          </Breadcrumbs>
        </div>

        {/* Controls in One Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="form-group flex flex-col w-full sm:w-[200px] min-w-[150px] max-w-[200px]">
            <CustomAutocomplete
              sx={{ width: "100%" }}
              options={[
                { label: dic["all"], value: IEntityStatus.all },
                { label: dic["active"], value: IEntityStatus.active },
                { label: dic["inactive"], value: IEntityStatus.inactive },
              ]}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <CustomTextField
                  autoComplete="off"
                  {...params}
                  label={dic.status}
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
                onSelectStatus(value?.value || "");
              }}
              value={
                isActive === "all"
                  ? { label: dic["all"], value: "all" }
                  : isActive === "active"
                    ? { label: dic["active"], value: "active" }
                    : { label: dic["inactive"], value: "inactive" }
              }
              size="small"
              loading={loading}
              disabled={loading}
            />
          </div>

          {/* Zone Filter */}
          <div className="form-group flex flex-col w-full sm:w-[480px] min-w-[200px] max-w-[250px]">
            <CustomAutocomplete
              sx={{ width: "100%" }}
              options={[
                { label: dic["all"], value: "all" },
                ...zoneList.map((zone) => ({
                  label: zone.name,
                  value: zone._id,
                })),
              ]}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <CustomTextField
                  autoComplete="off"
                  {...params}
                  label="ເລືອກໂຊນ"
                  placeholder="ເລືອກໂຊນ"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <i className="tabler-map-pin text-[16px] mr-2" />
                    ),
                  }}
                />
              )}
              onChange={(_, value) => {
                onSelectZone(value?.value || "");
              }}
              value={
                selectedZoneId === "all" || !selectedZoneId
                  ? { label: dic["all"], value: "all" }
                  : zoneList.find((z) => z._id === selectedZoneId)
                    ? {
                        label: zoneList.find((z) => z._id === selectedZoneId)!
                          .name,
                        value: selectedZoneId,
                      }
                    : { label: dic["all"], value: "all" }
              }
              size="small"
              loading={loading}
              disabled={loading}
            />
          </div>

          {/* Category Filter */}
          <div className="form-group flex flex-col w-full sm:w-[380px] min-w-[150px] max-w-[250px]">
            <CustomAutocomplete
              sx={{ width: "100%" }}
              options={[
                { label: dic["all"], value: "all" },
                ...categoryList.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
                })),
              ]}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <CustomTextField
                  autoComplete="off"
                  {...params}
                  label="ເລືອກປະເພດ"
                  placeholder="ເລືອກປະເພດ"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <i className="tabler-category text-[16px] mr-2" />
                    ),
                  }}
                />
              )}
              onChange={(_, value) => {
                onSelectCategory(value?.value || "");
              }}
              value={
                selectedCategoryId === "all" || !selectedCategoryId
                  ? { label: dic["all"], value: "all" }
                  : categoryList.find((c) => c._id === selectedCategoryId)
                    ? {
                        label: categoryList.find(
                          (c) => c._id === selectedCategoryId,
                        )!.name,
                        value: selectedCategoryId,
                      }
                    : { label: dic["all"], value: "all" }
              }
              size="small"
              loading={loading}
              disabled={loading}
            />
          </div>

          {/* Search Input */}
          <div className="form-group flex flex-col mt-5 ">
            <CustomTextField
              value={globalFilter ?? ""}
              onChange={(e) =>
                onGlobalFilterChange
                  ? onGlobalFilterChange(e.target.value)
                  : setGlobalFilter?.(e.target.value)
              }
              placeholder={dic.placeHolder?.search}
              size="small"
              inputProps={{ autoComplete: "off" }}
              InputProps={{
                startAdornment: (
                  <i className="tabler-search text-[16px] mr-2 text-gray-500" />
                ),
              }}
              sx={{ width: "200px" }}
            />
          </div>

          {/* Create Button */}
          <div className="form-group flex flex-col mt-6 justify-end items-end w-full flex-1 w-[150px]">
            <Button
              onClick={() => setToggleCreateComponent(true)}
              variant="contained"
              size="medium"
              disabled={loading}
              sx={{ minWidth: 150 }}
              startIcon={<i className="tabler-plus text-[18px] " />}
            >
              {dic.createRoomArea}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
