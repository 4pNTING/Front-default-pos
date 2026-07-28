import { Breadcrumbs, Button } from "@mui/material";
import Link from "next/link";
import { CustomerListProps } from "../../type/customerType";
import { useStore } from "../../store/customerStore";
import { ToastService } from "@/utils/toastService";
import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import CustomTextField from "@/@core/components/mui/TextField";
import { ICustomerGender, ICustomerNationality } from "@/utils/base";
import { useState, useEffect } from "react";

const HeaderComponent = ({
  props,
  globalFilter,
  setGlobalFilter,
  onGlobalFilterChange,
  loadCustomerCall,
}: {
  props: CustomerListProps;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onGlobalFilterChange?: (value: string) => void;
  loadCustomerCall?: any;
}) => {
  const { lang, dictionary: dic } = props;

  const {
    loading,
    setPagination,
    loadCustomerAPI,
    pageSize,
    toggleCreateComponent,
    setToggleCreateComponent,
    genderList,
    nationList,
    loadGenderList,
    loadNationList,
    selectedGender: storeSelectedGender,
    selectedNationality: storeSelectedNationality,
  } = useStore();

  useEffect(() => {
    loadGenderList();
    loadNationList();
  }, [loadGenderList, loadNationList]);

  async function onSelectGender(value: any) {
    try {
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
        selectedGender: value?._id,
      });

      await loadCustomerAPI({
        props: {
        query: loadCustomerCall,
          dictionary: dic,
        },
      });
    } catch (error: any) {
      ToastService.error(error.message);
    }
  }

  async function onSelectNationality(value: any) {
    try {
      setPagination({
        pageIndex: 0,
        pageSize: pageSize,
        selectedNationality: value?._id,
      });

      await loadCustomerAPI({
        props: {
        query: loadCustomerCall,
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
                  href="/customer"
                >
                  {dic.pageBreadcrumbs?.customerPage}
                </Link>
              </Breadcrumbs>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {/* Gender filter */}
            <div className="form-group flex flex-col w-[200px]">
              <CustomAutocomplete
                sx={{ maxWidth: 200, width: 200 }}
                options={genderList}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                getOptionLabel={(option) => option?.laName}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label={dic.selectGender}
                    placeholder={dic.selectGender}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <i className="tabler-gender-bigender text-[16px] mr-2" />
                      ),
                    }}
                  />
                )}
                onChange={(_, value) => onSelectGender(value)}
                value={
                  genderList.find((g) => g._id === storeSelectedGender) || null
                }
                size="small"
                loading={loading}
                loadingText={dic?.loading}
                noOptionsText={dic?.noDataAvailable}
              />
            </div>

            {/* Nation filter */}
            <div className="form-group flex flex-col w-[200px]">
              <CustomAutocomplete
                sx={{ maxWidth: 200, width: 200 }}
                options={nationList}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                getOptionLabel={(option) => option?.laName}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label={dic.selectNationality}
                    placeholder={dic.selectNationality}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <i className="tabler-flag text-[16px] mr-2" />
                      ),
                    }}
                  />
                )}
                onChange={(_, value) => onSelectNationality(value)}
                value={
                  nationList.find((n) => n._id === storeSelectedNationality) ||
                  null
                }
                size="small"
                loading={loading}
                loadingText={dic?.loading}
                noOptionsText={dic?.noDataAvailable}
              />
            </div>

            {/* Search input */}
            <div className="form-group flex flex-col mt-5">
              <CustomTextField
                sx={{ maxWidth: 300, width: 300 }}
                type="search"
                placeholder={dic.placeHolder?.search}
                value={globalFilter ?? ""}
                onChange={(e) =>
                  onGlobalFilterChange
                    ? onGlobalFilterChange(e.target.value)
                    : setGlobalFilter(e.target.value)
                }
                inputProps={{ autoComplete: "off" }}
              />
            </div>

            {/* Spacer to push button to right */}
            <div className="flex-grow"></div>

            {/* Create Customer Button */}
            <div className="form-group flex flex-col ml-auto mt-5">
              <Button
                size="medium"
                onClick={openCreateComponent}
                variant="contained"
                className="flex gap-4 items-center"
                sx={{ minWidth: 150 }}
              >
                <div className="tabler-circle-plus text-[20px] "></div>
                <span>{dic.createCustomer}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;
