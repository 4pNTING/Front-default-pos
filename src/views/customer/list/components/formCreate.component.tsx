import { useSession } from "next-auth/react";
import { CustomerListProps } from "../../type/customerType";
import { useStore, useCustomerMutations } from "../../store/customerStore";
import {
  Button,
  Autocomplete,
  TextField,
  IconButton,
  Chip,
  Divider,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useMemo, useState, useRef } from "react";
import { msgError, msgSuccess, msgConfirm } from "@/utils/sweetalert";
import { ToastService } from "@/utils/toastService";
import { ILeasingFileType } from "@/utils/base";
import CustomTextField from "@/@core/components/mui/TextField";
import { toast } from "react-toastify";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { Attachment, UploadFile } from "@core/components/custom-inputs";
import type { AttachedFile } from "@core/components/custom-inputs";
import {
  filesToAttachedFiles,
  attachedFilesToFiles,
} from "@/utils/fileAttachmentUtils";
import { LOAD_CUSTOMER } from "@/gql/queries/customer";
import Providers from "@/components/Providers";

const CreateComponent = ({
  props,
  onClose,
  onSuccess,
}: {
  props: CustomerListProps;
  onClose?: () => void;
  onSuccess?: () => void;
}) => {
  const { lang, dictionary: dic } = props;

  const [customerType, setCustomerType] = useState("1");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [village, setVillage] = useState("");
  const [phone, setPhone] = useState("");
  const [nationId, setNationId] = useState("");
  const [attachments, setAttachments] = useState<(File | string)[]>([]);
  const [customerFile, setCustomerFile] = useState<AttachedFile | null>(null);

  const [ContactId, setContactId] = useState("");
  const [ContactName, setContactName] = useState("");
  const [ContactFirstName, setContactFirstName] = useState("");
  const [ContactLastName, setContactLastName] = useState("");
  const [ContactPhone, setContactPhone] = useState("");
  const [ContactProvinceId, setContactProvinceId] = useState("");
  const [ContactDistrictId, setContactDistrictId] = useState("");
  const [ContactVillage, setContactVillage] = useState("");
  const saveIntentRef = useRef(false);
  const copyingRef = useRef(false);

  // hello world

  const { createCustomerMutation } = useCustomerMutations();

  const {
    toggleCreateComponent,
    setToggleCreateComponent,
    createCustomerAPI,
    loading,
    provinceList,
    loadProvinceList,
    districtList,
    loadDistrictList,
    villageList,
    loadVillageList,
    genderList,
    loadGenderList,
    nationList,
    loadNationList,
    setLoading,
    removeListenerState,
  } = useStore();

  useEffect(() => {
    loadProvinceList();
    loadDistrictList();
    loadVillageList();
    loadGenderList();
    loadNationList();
  }, [loadProvinceList, loadDistrictList, loadVillageList, loadGenderList, loadNationList]);

  useEffect(() => {
    setDistrictId("");
    setVillage("");
  }, [provinceId]);

  useEffect(() => {
    setVillage("");
  }, [districtId]);

  useEffect(() => {
    setContactDistrictId("");
    setContactVillage("");
  }, [ContactProvinceId]);

  useEffect(() => {
    setContactVillage("");
  }, [ContactDistrictId]);

  useEffect(() => {
    if (customerType === "1") {
      setContactFirstName("");
      setContactLastName("");
      setContactPhone("");
      setContactProvinceId("");
      setContactDistrictId("");
      setContactVillage("");
    }
  }, [customerType]);

  function closeCreateComponent() {
    setToggleCreateComponent(false);
    clearForm();
  }

  async function onSubmitCreate() {
    if (saveIntentRef.current) return;
    saveIntentRef.current = true;
    setLoading(true);

    try {
      if (!firstName || !lastName || !phone) {
        throw new Error(dic?.pleaseFilledAllInformation);
      }

      const provinceName = provinceList.find(
        (p) => p._id === provinceId,
      )?.laName;
      const districtName = districtList.find(
        (d) => d._id === districtId,
      )?.laName;
      const villageName = village;

      const contactProvinceName = provinceList.find(
        (p) => p._id === ContactProvinceId,
      )?.laName;
      const contactDistrictName = districtList.find(
        (d) => d._id === ContactDistrictId,
      )?.laName;
      const contactVillageName = ContactVillage;

      await createCustomerAPI({
        props: {
          mutation: createCustomerMutation,
          dictionary: dic,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phone,
          gender: gender,
          nationality: nationId,
          province: provinceName,
          district: districtName,
          village: villageName,
          customerFile: customerFile,
          contact:
            customerType === "2" && (ContactFirstName || ContactLastName || ContactPhone)
              ? {
                  firstName: ContactFirstName,
                  lastName: ContactLastName,
                  phoneNumber: ContactPhone,
                  province: contactProvinceName,
                  district: contactDistrictName,
                  village: contactVillageName,
                }
              : undefined,
        },
      });

      clearForm();
      setToggleCreateComponent(false);

      ToastService.createSuccess(dic);

      if (onSuccess) {
        onSuccess();
      } else {
        closeCreateComponent();
      }
    } catch (error: any) {
      ToastService.actionError("ເພີ່ມ Customer", error?.message, dic);
    } finally {
      setLoading(false);
      saveIntentRef.current = false;
    }
  }

  const handleAttachmentsChange = (files: (File | string)[]) => {
    setAttachments(files);
  };

  function handleCopyFromCustomer() {
    setContactFirstName(firstName);
    setContactLastName(lastName);
    setContactPhone(phone);

    setContactProvinceId(provinceId);
    setContactDistrictId(districtId);
    setContactVillage(village);
  }

  function clearForm() {
    setFirstName("");
    setLastName("");
    setGender("");
    setProvinceId("");
    setDistrictId("");
    setVillage("");
    setPhone("");
    setNationId("");
    setAttachments([]);
    setContactId("");
    setContactName("");
    setContactFirstName("");
    setContactLastName("");
    setContactPhone("");
    setContactProvinceId("");
    setContactDistrictId("");
    setContactVillage("");
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCreateComponent();
    }
  };

  const closeModal = () => {
    removeListenerState();
    closeCreateComponent();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Form Header - Room Style */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-100"
        style={{ backgroundColor: "#0A3981", color: "white" }}
      >
        <div className="flex items-center">
          <div className="w-10 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
            <i className="tabler-user text-xl text-white"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{dic?.customer}</h2>
          </div>
        </div>
      </div>

      {/* Form Body - Room Style */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Basic Information Section */}
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {dic?.personalInformation}
          </h2>
          <div className="bg-gradient-to-br from-blue-50/40 via-blue-25/20 to-white border border-blue-100/40 p-6 rounded-lg mb-4 shadow-sm">
            {/* Row 1: First Name, Last Name, Gender, Nation, Phone */}
            <div className="grid grid-cols-6 gap-4 mb-4">
              {/* First Name */}
              <div className="form-group">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.firstName}
                </label>
                <CustomTextField
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-user text-[18px] mr-1 " />
                    ),
                  }}
                />
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.lastName}
                </label>
                <CustomTextField
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-users text-[18px] mr-1 " />
                    ),
                  }}
                />
              </div>

              {/* Gender */}
              <div className="form-group  ">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.gender}
                </label>
                <Autocomplete
                  disablePortal
                  autoComplete={false}
                  options={genderList.map((g: any) => ({
                    label: g.laName,
                    value: g._id,
                  }))}
                  getOptionLabel={(o) => o.label}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  value={
                    genderList
                      .map((g: any) => ({
                        label: g.laName,
                        value: g._id,
                      }))
                      .find((o) => o.value === gender) ?? null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={dic?.selectGender}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <i className="tabler-gender-male text-[18px] mr-1 " />
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  onChange={(_, v) => {
                    setGender(v?.value ?? "");
                  }}
                  sx={{
                    "& .MuiAutocomplete-popper": { zIndex: 9999999 },
                    width: "100%",
                  }}
                  loading={loading}
                  loadingText={dic?.loading}
                  noOptionsText={dic?.noDataAvailable}
                />
              </div>
              {/* Phone */}
              <div className="form-group">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.phone}
                </label>
                <CustomTextField
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-phone text-[18px] mr-1 " />
                    ),
                  }}
                />
              </div>
              {/* Nationality */}
              <div className="form-group">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.nationality}
                </label>
                <Autocomplete
                  disablePortal
                  autoComplete={false}
                  options={nationList.map((n: any) => ({
                    label: n.laName,
                    value: n._id,
                  }))}
                  getOptionLabel={(o) => o.label}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  value={
                    nationList
                      .map((n: any) => ({
                        label: n.laName,
                        value: n._id,
                      }))
                      .find((o) => o.value === nationId) ?? null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={dic?.selectNationality}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <i className="tabler-flag text-[18px] mr-1 " />
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  onChange={(_, v) => {
                    setNationId(v?.value ?? "");
                  }}
                  sx={{
                    "& .MuiAutocomplete-popper": {
                      zIndex: 9999999,
                    },
                  }}
                  loading={loading}
                  loadingText={dic?.loading}
                  noOptionsText={dic?.noDataAvailable}
                />
              </div>
              {/* Province */}
              <div className="form-group">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.province}
                </label>
                <Autocomplete
                  disablePortal
                  autoComplete={false}
                  options={provinceList.map((p: any) => ({
                    label: p.laName || p.enName,
                    value: p._id,
                  }))}
                  getOptionLabel={(o) => o.label}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  value={
                    provinceList
                      .map((p: any) => ({
                        label: p.laName || p.enName,
                        value: p._id,
                      }))
                      .find((o) => o.value === provinceId) ?? null
                  }
                  onChange={(_, v) => {
                    setProvinceId(v?.value ?? "");
                    setDistrictId("");
                    setVillage("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={dic?.selectProvince}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <i className="tabler-map text-[18px] mr-1" />
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  sx={{ "& .MuiAutocomplete-popper": { zIndex: 9999999 } }}
                  loading={loading}
                  loadingText={dic?.loading}
                  noOptionsText={dic?.noDataAvailable}
                />
              </div>
            </div>

            {/* Row 2: Gender, Date of Birth, Phone, Nationality */}
            <div className="grid grid-cols-6 gap-4 mb-4">
              {/* District */}
              <div className="form-group">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.district}
                </label>

                <Autocomplete
                  disablePortal
                  autoComplete={false}
                  options={districtList.map((d: any) => ({
                    label: d.laName || d.enName,
                    value: d._id,
                  }))}
                  getOptionLabel={(o) => o.label}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  value={
                    districtList
                      .map((d: any) => ({
                        label: d.laName || d.enName,
                        value: d._id,
                      }))
                      .find((o) => o.value === districtId) ?? null
                  }
                  onChange={(_, v) => {
                    setDistrictId(v?.value ?? "");
                    setVillage("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={dic?.selectDistrict}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <i className="tabler-building-community text-[18px] mr-1" />
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  disabled={!provinceId}
                  loading={loading}
                  loadingText={dic?.loading}
                  noOptionsText={dic?.noDataAvailable}
                  sx={{ "& .MuiAutocomplete-popper": { zIndex: 9999999 } }}
                />
              </div>

              {/* Village */}
              <div className="form-group">
                <label className="block text-l font-medium mb-2 ">
                  {dic?.village}
                </label>
                <CustomTextField
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-home text-[18px] mr-1" />
                    ),
                  }}
                />
              </div>
              {/* Attachments - Full Width Row (Single file upload like leasing) */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="form-group mt-1">
                  <UploadFile
                    title={dic?.attachmentsInformation}
                    file={customerFile}
                    onFileChange={setCustomerFile}
                    ownerId={"temp-" + Date.now()}
                    ownerType={ILeasingFileType.mmsCustomer}
                    maxFileSize={10}
                    acceptedTypes={[".pdf", ".jpg", ".png"]}
                    disabled={loading}
                    dic={dic}
                    autoUpload={false}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Province, District, Village */}
          </div>

          {/* Contact Information Section */}
          <div className="mb-2">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {dic?.contactInformation}
            </h2>

            <div className="flex justify-between items-center mb-2">
              <div className=" p-1 rounded-lg">
                <RadioGroup
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="mb-1"
                >
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <FormControlLabel
                      value="1"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            padding: "6px",
                            "& .MuiSvgIcon-root": { fontSize: "1.1rem" },
                          }}
                        />
                      }
                      label={dic?.noDataAvailable}
                      className="text-xs"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.875rem",
                          lineHeight: 1.2,
                          fontWeight: 600,
                          color: "#374151",
                        },
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                    <FormControlLabel
                      value="2"
                      control={
                        <Radio
                          size="small"
                          sx={{
                            padding: "6px",
                            "& .MuiSvgIcon-root": { fontSize: "1.1rem" },
                          }}
                        />
                      }
                      label={dic?.hasDataAvailable}
                      className="text-xs"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.875rem",
                          lineHeight: 1.2,
                          fontWeight: 600,
                          color: "#374151",
                        },
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                  </div>
                </RadioGroup>
              </div>
            </div>
            {/* Customer Type Radio */}

            {/* Show contact fields only for Company */}
            {customerType === "2" && (
              <>
                <div className="bg-gradient-to-br from-blue-50/40 via-blue-25/20 to-white border border-blue-100/40 p-6 rounded-lg mb-4 shadow-sm">
                  {/* Row 1: Names and Phone */}
                  <div className="grid grid-cols-6 gap-4 mb-4">
                    <div className="form-group">
                      <label className="block text-l font-medium mb-2 ">
                        {dic?.contactFirstName}
                      </label>
                      <CustomTextField
                        value={ContactFirstName}
                        onChange={(e) => setContactFirstName(e.target.value)}
                        fullWidth
                        size="small"
                        autoComplete="off"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-user text-[18px] mr-1" />
                          ),
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-l font-medium mb-2 ">
                        {dic?.contactLastName}
                      </label>
                      <CustomTextField
                        value={ContactLastName}
                        onChange={(e) => setContactLastName(e.target.value)}
                        fullWidth
                        size="small"
                        autoComplete="off"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-users text-[18px] mr-1" />
                          ),
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-l font-medium mb-2 ">
                        {dic?.contactPhone}
                      </label>
                      <CustomTextField
                        value={ContactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        fullWidth
                        size="small"
                        autoComplete="off"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-phone-call text-[18px] mr-1" />
                          ),
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-l font-medium mb-2 ">
                        {dic?.province}
                      </label>
                      <Autocomplete
                        disablePortal
                        autoComplete={false}
                        options={provinceList.map((p: any) => ({
                          label: p.laName || p.enName,
                          value: p._id,
                        }))}
                        getOptionLabel={(o) => o.label}
                        isOptionEqualToValue={(a, b) => a.value === b.value}
                        value={
                          provinceList
                            .map((p: any) => ({
                              label: p.laName || p.enName,
                              value: p._id,
                            }))
                            .find((o) => o.value === ContactProvinceId) ?? null
                        }
                        onChange={(_, v) => {
                          setContactProvinceId(v?.value ?? "");
                          setContactDistrictId("");
                          setContactVillage("");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={dic?.selectProvince}
                            size="small"
                            variant="outlined"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <i className="tabler-map text-[18px] mr-1" />
                                  {params.InputProps?.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        sx={{
                          "& .MuiAutocomplete-popper": { zIndex: 9999999 },
                        }}
                        loading={loading}
                        loadingText={dic?.loading}
                        noOptionsText={dic?.noDataAvailable}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-l font-medium mb-2 ">
                        {dic?.district}
                      </label>
                      <Autocomplete
                        disablePortal
                        autoComplete={false}
                        options={districtList.map((d: any) => ({
                          label: d.laName || d.enName,
                          value: d._id,
                        }))}
                        getOptionLabel={(o) => o.label}
                        isOptionEqualToValue={(a, b) => a.value === b.value}
                        value={
                          districtList
                            .map((d: any) => ({
                              label: d.laName || d.enName,
                              value: d._id,
                            }))
                            .find((o) => o.value === ContactDistrictId) ?? null
                        }
                        onChange={(_, v) => {
                          setContactDistrictId(v?.value ?? "");
                          setContactVillage("");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={dic?.selectDistrict}
                            size="small"
                            variant="outlined"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <i className="tabler-building-community text-[18px] mr-1" />
                                  {params.InputProps?.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        disabled={!ContactProvinceId}
                        loading={loading}
                        loadingText={dic?.loading}
                        noOptionsText={dic?.noDataAvailable}
                        sx={{
                          "& .MuiAutocomplete-popper": { zIndex: 9999999 },
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-l font-medium mb-2 ">
                        {dic?.village}
                      </label>
                      <CustomTextField
                        value={ContactVillage}
                        onChange={(e) => setContactVillage(e.target.value)}
                        fullWidth
                        size="small"
                        autoComplete="off"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-home text-[18px] mr-1" />
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2 p-4  mt-4">
            <Button
              size="medium"
              onClick={closeCreateComponent}
              variant="contained"
              color="secondary"
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 500,
                minWidth: "130px",
              }}
            >
              <>
                <i className="tabler-x text-[18px] mr-2" />
                {dic?.cancel}
              </>
            </Button>

            <Button
              // disabled={loading || !customId || !firstName || !lastName || !phone || !provinceId || !districtId || !villageId}
              size="medium"
              onClick={onSubmitCreate}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 500,
                minWidth: "130px",
              }}
            >
              {loading && saveIntentRef.current ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-1"></div>
                  {dic?.creating}
                </>
              ) : (
                <>
                  <i className="tabler-device-floppy mr-2"></i>
                  {dic?.save}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
