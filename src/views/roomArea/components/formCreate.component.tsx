import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { RoomAreaListProps } from "../type/roomAreaType";
import { useStore, useRoomAreaMutations } from "../store/roomAreaStore";
import {
  Button,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { msgError, msgSuccess } from "@/utils/sweetalert";
import {
  IRoleConfigLevel,
  IRoomAreaHoldStatus,
  IRoomAreaAgentHoldStatus,
  IRoomAreaCurrency,
  ILeasingFileType,
  currencyFormatInput,
} from "@/utils/base";
import CustomTextField from "@/@core/components/mui/TextField";
import { formatDecimalInput, parseDecimalNumber } from "@/utils/formatUtils";
import {
  calculateByCurrency,
  formatNumberWithoutDecimals,
} from "@/utils/currencyCalculation";
import { UploadFile } from "@/@core/components/custom-inputs";
import type { AttachedFile } from "@/@core/components/custom-inputs";
import { ToastService } from "@/utils/toastService";
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";
import { uploadOwnerFile } from "@/utils/fileUploadService";

const CreateComponent = ({ props }: { props: RoomAreaListProps }) => {
  // Var
  const { lang, dictionary: dic } = props;

  // States - ตรงตาม GraphQL type
  const [name, setName] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [roomAreaCategoryId, setRoomAreaCategoryId] = useState("");
  const [wide, setWide] = useState("");
  const [long, setLong] = useState("");
  const [moreArea, setMoreArea] = useState("0");
  const [amount, setAmount] = useState("");
  const [centralAmount, setCentralAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [currency, setCurrency] = useState("1");

  const [holdStatus, setHoldStatus] = useState<string>(
    IRoomAreaHoldStatus.rent,
  );
  const [agentHoldStatus, setAgentHoldStatus] = useState<string>(
    IRoomAreaAgentHoldStatus.bu,
  );

  const [buyerFirstName, setBuyerFirstName] = useState("");
  const [buyerLastName, setBuyerLastName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [purchaseContractFile, setPurchaseContractFile] =
    useState<AttachedFile | null>(null);

  const [transferStartDate, setTransferStartDate] = useState<Date | null>(null);
  const [transferEndDate, setTransferEndDate] = useState<Date | null>(null);
  const [transferRemarks, setTransferRemarks] = useState("");
  const [transferContractFile, setTransferContractFile] =
    useState<AttachedFile | null>(null);

  const calculatedTotalArea = useMemo(() => {
    const w = parseDecimalNumber(wide);
    const l = parseDecimalNumber(long);
    const m = parseDecimalNumber(moreArea);
    const totalArea = w * l;
    const finalArea = Number((totalArea - m).toFixed(2));
    return Math.max(0, finalArea);
  }, [wide, long, moreArea]);

  const calculatedTotalAreaAmount = useMemo(() => {
    const a = parseDecimalNumber(amount);
    const result = calculatedTotalArea * a;
    const val = calculateByCurrency(result, currency);
    // For non-LAK, ensure 2 decimals precision to match UI (e.g. 1121.465 -> 1121.47)
    return currency === "1" ? val : Number(val.toFixed(2));
  }, [calculatedTotalArea, amount, currency]);

  const calculatedTotalAreaCentralAmount = useMemo(() => {
    const c = parseDecimalNumber(centralAmount);
    const result = calculatedTotalArea * c;
    const val = calculateByCurrency(result, currency);
    return currency === "1" ? val : Number(val.toFixed(2));
  }, [calculatedTotalArea, centralAmount, currency]);

  const calculatedGrandTotal = useMemo(() => {
    const total = calculatedTotalAreaAmount + calculatedTotalAreaCentralAmount;
    const val = calculateByCurrency(total, currency);
    // Grand total also needs rounding to avoid 0.1+0.2 floating point issues
    return currency === "1" ? val : Number(val.toFixed(2));
  }, [calculatedTotalAreaAmount, calculatedTotalAreaCentralAmount, currency]);
  const {
    toggleCreateComponent,
    setToggleCreateComponent,
    createRoomAreaAPI,
    resetModalState,
    removeListenerState,
    loading,
    zoneList,
    categoryList,
  } = useStore();

  const { createRoomAreaMutation } = useRoomAreaMutations();

  const floorList = zoneList;
  const roomTypeList = categoryList;
  const currencyList = [
    { id: "1", code: IRoomAreaCurrency.LAK },
    { id: "2", code: IRoomAreaCurrency.USD },
    { id: "3", code: IRoomAreaCurrency.THB },
  ];
  const roomCategoryList = [
    { id: IRoomAreaHoldStatus.rent, nameLao: "ຫ້ອງເຊົ່າ" },
    { id: IRoomAreaHoldStatus.buyer, nameLao: "ຫ້ອງຊື້" },
  ];
  const agentHoldStatusList = [
    { id: IRoomAreaAgentHoldStatus.owner, nameLao: "ເຈົ້າຂອງຢູ່ເອງ" },
    { id: IRoomAreaAgentHoldStatus.agent, nameLao: "ໂອນສິດບໍລິຫານ" },
  ];

  // When holdStatus changes, auto-select appropriate agentHoldStatus and clear fields
  useEffect(() => {
    if (holdStatus === IRoomAreaHoldStatus.rent) {
      setAgentHoldStatus(IRoomAreaAgentHoldStatus.bu);
      // Clear buyer fields
      setBuyerFirstName("");
      setBuyerLastName("");
      setBuyerPhone("");
      setBuyerAddress("");
      setPurchaseContractFile(null);
      // Clear transfer fields
      setTransferStartDate(null);
      setTransferEndDate(null);
      setTransferRemarks("");
      setTransferContractFile(null);
    } else if (holdStatus === IRoomAreaHoldStatus.buyer) {
      setAgentHoldStatus(IRoomAreaAgentHoldStatus.owner);
      // Clear transfer fields when selecting owner
      setTransferStartDate(null);
      setTransferEndDate(null);
      setTransferRemarks("");
      setTransferContractFile(null);
    }
  }, [holdStatus]);

  // When agentHoldStatus changes to 'owner', clear transfer fields
  useEffect(() => {
    if (agentHoldStatus === IRoomAreaAgentHoldStatus.owner) {
      setTransferStartDate(null);
      setTransferEndDate(null);
      setTransferRemarks("");
      setTransferContractFile(null);
    }
  }, [agentHoldStatus]);

  useEffect(() => {
    const wideNum = parseDecimalNumber(wide);
    const longNum = parseDecimalNumber(long);
    const moreAreaNum = parseDecimalNumber(moreArea);
    const totalArea = wideNum * longNum;
    const finalArea = Number((totalArea - moreAreaNum).toFixed(2));
    const calculatedArea = Math.max(0, finalArea);

    const amountNum = parseDecimalNumber(amount);
    const centralAmountNum = parseDecimalNumber(centralAmount);
    const totalRent = calculateByCurrency(calculatedArea * amountNum, currency);
    const totalCommon = calculateByCurrency(
      calculatedArea * centralAmountNum,
      currency,
    );
    const calculatedTotal = calculateByCurrency(
      totalRent + totalCommon,
      currency,
    );

    if (calculatedTotal > 0) {
      setTotalAmount(formatNumberWithoutDecimals(calculatedTotal, currency));
    } else {
      setTotalAmount("0");
    }
  }, [wide, long, moreArea, amount, centralAmount, currency]);

  function closeCreateComponent() {
    setToggleCreateComponent(false);
    resetModalState();
  }

  async function onCreateRoom() {
    try {
      if (!(name && zoneId && roomAreaCategoryId)) {
        await msgError({
          title: dic?.reject,
          text: dic?.pleaseFilledAllInformation,
          btnOKText: dic?.ok,
          btnOKColor: "#2F57AB",
        });
        return;
      }

      if (holdStatus === IRoomAreaHoldStatus.buyer) {
        if (!(buyerFirstName && buyerLastName && buyerPhone && buyerAddress)) {
          await msgError({
            title: dic?.reject,
            text: dic?.BuyerInformationRequired,
            btnOKText: dic?.ok,
            btnOKColor: "#2F57AB",
          });
          return;
        }
      }

      if (
        holdStatus === IRoomAreaHoldStatus.buyer &&
        agentHoldStatus === IRoomAreaAgentHoldStatus.agent
      ) {
        if (!(transferStartDate && transferEndDate)) {
          await msgError({
            title: dic?.reject,
            text: dic?.TransferDatesRequired,
            btnOKText: dic?.ok,
            btnOKColor: "#2F57AB",
          });
          return;
        }
      }

      const currencyMapping: Record<string, IRoomAreaCurrency> = {
        "1": IRoomAreaCurrency.LAK,
        "2": IRoomAreaCurrency.USD,
        "3": IRoomAreaCurrency.THB,
      };
      const currencyCode = currencyMapping[currency] || IRoomAreaCurrency.LAK;

      // Get purchase contract file URL
      let finalPurchaseContractUrl: string | undefined = undefined;
      if (holdStatus === IRoomAreaHoldStatus.buyer && purchaseContractFile) {
        if (purchaseContractFile.file) {
          // Upload new file
          const url = await uploadOwnerFile({
            file: purchaseContractFile.file,
            ownerId: name || zoneId + Date.now(),
            ownerType: ILeasingFileType.mmsRoomAreaOwnership,
            dic,
          });
          finalPurchaseContractUrl = url || undefined;
        } else if (purchaseContractFile.url) {
          // Use existing URL
          finalPurchaseContractUrl = purchaseContractFile.url;
        }
      }

      // Get transfer contract file URL
      let finalTransferContractUrl: string | undefined = undefined;
      if (
        holdStatus === IRoomAreaHoldStatus.buyer &&
        agentHoldStatus === IRoomAreaAgentHoldStatus.agent &&
        transferContractFile
      ) {
        if (transferContractFile.file) {
          // Upload new file
          const url = await uploadOwnerFile({
            file: transferContractFile.file,
            ownerId: name || zoneId + Date.now(),
            ownerType: ILeasingFileType.mmsRoomAreaOwnershipAgent,
            dic,
          });
          finalTransferContractUrl = url || undefined;
        } else if (transferContractFile.url) {
          // Use existing URL
          finalTransferContractUrl = transferContractFile.url;
        }
      }

      const buyerData =
        holdStatus === IRoomAreaHoldStatus.buyer
          ? {
            buyerFirstName,
            buyerLastName,
            buyerPhone,
            buyerAddress,
            purchaseContract: finalPurchaseContractUrl
              ? [finalPurchaseContractUrl]
              : [],
          }
          : undefined;

      const transferData =
        holdStatus === IRoomAreaHoldStatus.buyer &&
          agentHoldStatus === IRoomAreaAgentHoldStatus.agent
          ? {
            transferStartDate,
            transferEndDate,
            transferRemarks,
            transferContract: finalTransferContractUrl
              ? [finalTransferContractUrl]
              : [],
          }
          : undefined;

      await createRoomAreaAPI({
        props: {
          lang: lang,
          mutation: createRoomAreaMutation,
          name: name,
          zoneId: zoneId,
          roomAreaCategoryId: roomAreaCategoryId,
          wide: parseDecimalNumber(wide),
          long: parseDecimalNumber(long),
          moreArea: parseDecimalNumber(moreArea),
          totalAreaAmount: parseDecimalNumber(amount),
          totalAreaCentralAmount: parseDecimalNumber(centralAmount),
          amount: calculatedTotalAreaAmount,
          centralAmount: calculatedTotalAreaCentralAmount,
          totalAmount: calculatedGrandTotal,
          currency: currencyCode,
          holdStatus: holdStatus,
          agentHoldStatus: agentHoldStatus,
          ...(buyerData && { buyer: buyerData }),
          ...(transferData && { transfer: transferData }),
          status: "active",
        },
      });

      resetForm();
      msgSuccess({
        title: dic?.createRoomSuccess,
        text: dic?.createRoomSuccess,
        btnOKText: dic?.ok,
        btnOKColor: "#2F57AB",
      });
      closeCreateComponent();
    } catch (error: any) {
      msgError({
        title: dic?.reject,
        text: error.message,
        btnOKText: dic?.ok,
        btnOKColor: "#2F57AB",
      });
    }
  }

  const resetForm = () => {
    setName("");
    setZoneId("");
    setRoomAreaCategoryId("");
    setWide("");
    setLong("");
    setMoreArea("0");
    setAmount("0");
    setCentralAmount("0");
    setCurrency("1");
    setHoldStatus(IRoomAreaHoldStatus.rent);
    setAgentHoldStatus(IRoomAreaAgentHoldStatus.bu);
    setBuyerFirstName("");
    setBuyerLastName("");
    setBuyerPhone("");
    setBuyerAddress("");
    setTransferStartDate(null);
    setTransferEndDate(null);
    setTransferRemarks("");
    setPurchaseContractFile(null);
    setTransferContractFile(null);
  };

  const closeModal = () => {
    setToggleCreateComponent(false);
    resetModalState();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Form Header - Leasing Style */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-100"
        style={{ backgroundColor: "#0A3981", color: "white" }}
      >
        <div className="flex items-center">
          <div className="w-10 h-9 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
            <i className="tabler-building text-xl text-white"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{dic?.room}</h2>
          </div>
        </div>
      </div>

      {/* Form Body - Full height, outer scroll */}
      <div className="px-6 pt-6">
        {/* ========== SECTION 1: ຫ້ອງ (Room Info) ========== */}
        <div>
          {/* Header */}
          <h3 className="text-l font-semibold mb-2 text-gray-800  border-gray-200 pb-1 mb-">
            {dic?.roomInfo}
          </h3>
        </div>
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-2 bg-gray-50 p-4 rounded-lg">
            {/* Row 1: Floor, Room Code, Room Type, Width, Length, Extra Area - 6 equal columns */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {/* Floor Selection */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mb-1 ">
                  {dic?.floor}
                </label>
                <Autocomplete
                  disablePortal
                  options={floorList.map((zone: any) => ({
                    label: zone.name,
                    id: zone._id || zone.id,
                  }))}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      {...params}
                      placeholder={dic?.placeHolder?.selectFloor}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <i className="tabler-map-pin text-[18px] mr-1" />
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  onChange={(event, value) => {
                    setZoneId(value?.id || "");
                  }}
                  value={
                    floorList.length > 0 && zoneId
                      ? floorList
                        .map((zone: any) => ({
                          label: zone.name,
                          id: zone._id || zone.id,
                        }))
                        .find((option) => option.id === zoneId) || null
                      : null
                  }
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

              {/* Room Code */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mb-1 ">
                  {dic?.roomCode}
                </label>
                <CustomTextField
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-hash text-[18px] mr-1" />
                    ),
                  }}
                />
              </div>

              {/* Room Type */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mb-1 ">
                  {dic?.roomType}
                </label>
                <Autocomplete
                  disablePortal
                  options={roomTypeList.map((cat: any) => ({
                    label: cat.name,
                    id: cat._id || cat.id,
                  }))}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      {...params}
                      placeholder="ເລືອກປະເພດຫ້ອງ"
                      size="small"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <i className="tabler-door text-[16px] mr-1" />
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  onChange={(event, value) => {
                    setRoomAreaCategoryId(value?.id || "");
                  }}
                  value={
                    roomTypeList.length > 0 && roomAreaCategoryId
                      ? roomTypeList
                        .map((cat: any) => ({
                          label: cat.name,
                          id: cat._id || cat.id,
                        }))
                        .find(
                          (option: any) => option.id === roomAreaCategoryId,
                        ) || null
                      : null
                  }
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

              {/* Width */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mb-1 ">
                  {dic?.width}{" "}
                  <span className="text-xs" style={{ textTransform: "none" }}>
                    (m<sup></sup>)
                  </span>
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  inputMode="decimal"
                  value={wide}
                  onChange={(e) => setWide(currencyFormatInput(e.target.value))}
                  placeholder=""
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-arrow-left-right text-[18px] mr-1" />
                    ),
                  }}
                />
              </div>

              {/* Length */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mb-1 ">
                  {dic?.length}{" "}
                  <span className="text-xs" style={{ textTransform: "none" }}>
                    (m<sup></sup>)
                  </span>
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  inputMode="decimal"
                  value={long}
                  onChange={(e) => setLong(currencyFormatInput(e.target.value))}
                  placeholder=""
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-ruler text-[18px] mr-1" />
                    ),
                  }}
                />
              </div>

              {/* Extra Area */}
              <div className="form-group">
                <label className="block text-[14px] font-medium   ">
                  {dic?.extraArea}
                  (m<sup>2</sup>)
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  inputMode="decimal"
                  value={moreArea}
                  onChange={(e) =>
                    setMoreArea(currencyFormatInput(e.target.value))
                  }
                  placeholder="0"
                  fullWidth
                  size="small"
                  className="bg-gray-100"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      fontSize: "14px",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#10b981",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-dimensions text-[18px] mr-1 text-green-600" />
                    ),
                  }}
                />
              </div>
              {/* 3. Area (Auto calculated) */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mr-1    ">
                  {dic?.area}
                  (m<sup>2</sup>)
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  value={calculatedTotalArea.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  disabled
                  placeholder="ອັດຕະໂນມັດ"
                  fullWidth
                  size="small"
                  className="bg-gray-100"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-calculator text-[18px] mr-1" />
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#575757ff",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== SECTION: ການຄິດໄລ່ (Calculation) ========== */}
        <div className="mb-6">
          <div>
            <h3 className="text-l font-semibold mb-2 text-gray-800 border-gray-200 pb-1 mb-">
              {dic?.calculationRoomArea}
            </h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-6 gap-2 mb-2">
              {/* Currency Selection */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mt-1 ">
                  {dic?.currency}
                </label>
                <Autocomplete
                  disablePortal
                  options={currencyList.map((currency) => ({
                    label: currency.code,
                    value: currency.code,
                    id: currency.id,
                  }))}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      {...params}
                      placeholder={dic?.currency}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <i className="tabler-coins text-[18px] mr-1" />
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                          fontWeight: "500",
                        },
                      }}
                    />
                  )}
                  onChange={(event, value) => {
                    setCurrency(value?.id || "");
                  }}
                  value={
                    currencyList.length > 0 && currency
                      ? currencyList
                        .map((curr) => ({
                          label: curr.code,
                          value: curr.code,
                          id: curr.id,
                        }))
                        .find((option) => option.id === currency) || null
                      : null
                  }
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
              {/* 1. Rent Price per sq.m (User Input, Backend: totalAreaAmount) */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mr-1 mt-1  ">
                  {dic?.rentPrice}
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) =>
                    setAmount(currencyFormatInput(e.target.value))
                  }
                  placeholder=""
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-cash text-[18px] mr-1" />
                    ),
                  }}
                />
              </div>

              {/* 2. Common Price per sq.m (User Input) */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mt-1 ">
                  {dic?.averagePrice}
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  inputMode="decimal"
                  value={centralAmount}
                  onChange={(e) =>
                    setCentralAmount(currencyFormatInput(e.target.value))
                  }
                  placeholder=""
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-building-community text-[18px] mr-1 " />
                    ),
                  }}
                />
              </div>

              {/* 4. Room Total Price (Backend: amount) = totalArea × rentPrice */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mr-1 mt-1  ">
                  {dic?.totalAreaAmount}
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  inputMode="decimal"
                  value={
                    amount && calculatedTotalAreaAmount > 0
                      ? formatNumberWithoutDecimals(
                        calculatedTotalAreaAmount,
                        currency,
                      )
                      : ""
                  }
                  placeholder="0"
                  fullWidth
                  disabled
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-calculator text-[18px] mr-1 text-blue-500" />
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#2563eb",
                      fontWeight: 600,
                    },
                  }}
                />
              </div>

              {/* 5. totalAreaCentralAmount = totalArea × centralAmount */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mr-1 mt-1  ">
                  {dic.totalUtilities}
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  inputMode="decimal"
                  value={
                    centralAmount && calculatedTotalAreaCentralAmount > 0
                      ? formatNumberWithoutDecimals(
                        calculatedTotalAreaCentralAmount,
                        currency,
                      )
                      : ""
                  }
                  placeholder="0"
                  fullWidth
                  disabled
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-calculator text-[18px] mr-1 text-green-600" />
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#16a34a",
                      fontWeight: 600,
                    },
                  }}
                />
              </div>

              {/* 6. Grand Total = amount + totalAreaCentralAmount */}
              <div className="form-group">
                <label className="block text-[14px] font-medium mb-1 ">
                  {dic?.totalPrice}
                </label>
                <CustomTextField
                  autoComplete="off"
                  type="text"
                  value={
                    calculatedGrandTotal > 0
                      ? formatNumberWithoutDecimals(
                        calculatedGrandTotal,
                        currency,
                      )
                      : ""
                  }
                  disabled
                  placeholder="0"
                  fullWidth
                  size="small"
                  className="bg-gray-100"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      fontSize: "14px",
                      fontWeight: "bold",
                      WebkitTextFillColor: "#dc2626",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <i className="tabler-moneybag text-[18px] mr-1 text-red-600" />
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== SECTION 2: ການຂາຍ (Sales/Ownership) ========== */}
        <div className="mb-6">
          <div>
            {/* Header */}
            <h3 className="text-l font-semibold mb-2 text-gray-800  border-gray-200 pb-1 mb-">
              {dic?.ownership}
            </h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* Room Category Radio - Dynamic from service */}
            <div className="mb-2">
              <RadioGroup
                value={holdStatus}
                onChange={(e) => setHoldStatus(e.target.value)}
                className="mb-2"
              >
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {roomCategoryList.map((category) => (
                    <FormControlLabel
                      key={category.id}
                      value={category.id}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            padding: "6px",
                            "& .MuiSvgIcon-root": {
                              fontSize: "1.1rem",
                            },
                          }}
                        />
                      }
                      label={category.nameLao}
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
                  ))}
                </div>
              </RadioGroup>

              {/* Purchase Room Fields */}
              {holdStatus === IRoomAreaHoldStatus.buyer && (
                <>
                  {/* Row 1: Buyer Info - 6 columns */}
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    <div className="form-group">
                      <label className="block text-sm font-medium mb-2 ">
                        {dic?.firstName}
                      </label>
                      <CustomTextField
                        autoComplete="off"
                        value={buyerFirstName}
                        onChange={(e) => setBuyerFirstName(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-user text-[18px] mr-1  " />
                          ),
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium mb-2 ">
                        {dic?.lastName}
                      </label>
                      <CustomTextField
                        autoComplete="off"
                        value={buyerLastName}
                        onChange={(e) => setBuyerLastName(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-users text-[18px] mr-1 " />
                          ),
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium mb-2 ">
                        {dic?.phone}
                      </label>
                      <CustomTextField
                        autoComplete="off"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-phone text-[18px] mr-1 " />
                          ),
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium mb-2 ">
                        {dic?.address}
                      </label>
                      <CustomTextField
                        autoComplete="off"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-map-pin text-[18px] mr-1 " />
                          ),
                        }}
                      />
                    </div>

                    {/* Purchase Contract Attachment spanning 1 column */}
                    <div className="form-group ml-2">
                      <div className="h-[38px]">
                        <UploadFile
                          title={dic?.attachments}
                          file={purchaseContractFile}
                          onFileChange={(file) => setPurchaseContractFile(file)}
                          ownerId={name + Date.now()}
                          ownerType={ILeasingFileType.mmsLeasing}
                          maxFileSize={10}
                          acceptedTypes={[".pdf", ".jpg", ".png"]}
                          disabled={loading}
                          autoUpload={false}
                          dic={dic}
                        />
                      </div>
                    </div>

                    {/* Empty space for balance */}
                    <div className="form-group"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========== SECTION 3: ດໍາເນີນການ (Process/Management) - Show only for ຫ້ອງຊື້ ========== */}
        {holdStatus === IRoomAreaHoldStatus.buyer && (
          <div className="mb-6">
            <div>
              {/* Header */}
              <h3 className="text-l font-semibold mb-2 text-gray-800 border-gray-200 pb-1 mb-1">
                {dic?.proceed}
              </h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <RadioGroup
                row
                value={agentHoldStatus}
                onChange={(e) => setAgentHoldStatus(e.target.value)}
                className="mb-4"
              >
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {agentHoldStatusList.map((type) => (
                    <FormControlLabel
                      key={type.id}
                      value={type.id}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            padding: "6px",
                            "& .MuiSvgIcon-root": {
                              fontSize: "1.1rem",
                            },
                          }}
                        />
                      }
                      label={type.nameLao}
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
                  ))}
                </div>
              </RadioGroup>

              {agentHoldStatus === IRoomAreaAgentHoldStatus.agent && (
                <>
                  {/* Row 1: Start Date, End Date, Remarks - 6 columns */}
                  <div className="grid grid-cols-6 gap-2 ">
                    <div className="form-group">
                      <label className="block text-sm font-medium mb-2 ">
                        {dic?.startDate}
                      </label>
                      <AppReactDatepicker
                        selected={transferStartDate}
                        onChange={(date: Date | null) =>
                          setTransferStartDate(date)
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        customInput={
                          <CustomTextField
                            autoComplete="off"
                            fullWidth
                            size="small"
                          />
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium mb-2 ">
                        {dic?.endDate}
                      </label>
                      <AppReactDatepicker
                        selected={transferEndDate}
                        onChange={(date: Date | null) =>
                          setTransferEndDate(date)
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        minDate={transferStartDate || undefined}
                        customInput={
                          <CustomTextField
                            autoComplete="off"
                            fullWidth
                            size="small"
                          />
                        }
                      />
                    </div>

                    <div className="form-group col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        {dic?.notes}
                      </label>
                      <CustomTextField
                        autoComplete="off"
                        value={transferRemarks}
                        onChange={(e) => setTransferRemarks(e.target.value)}
                        fullWidth
                        size="small"
                        multiline
                        rows={1}
                        InputProps={{
                          startAdornment: (
                            <i className="tabler-note text-[18px] mr-1 " />
                          ),
                        }}
                      />
                    </div>

                    {/* Transfer Contract Attachment - Same row */}
                    <div className="form-group col-span-1 ml-2">
                      <div className="h-[38px]">
                        <UploadFile
                          title={dic?.attachments}
                          file={transferContractFile}
                          onFileChange={(file) => setTransferContractFile(file)}
                          ownerId={name + Date.now()}
                          ownerType={ILeasingFileType.mmsLeasing}
                          maxFileSize={10}
                          acceptedTypes={[".pdf", ".jpg", ".png"]}
                          disabled={loading}
                          autoUpload={false}
                          dic={dic}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className=" p-3 border-t border-gray-100 bg-gray-50 ">
        <div className="flex justify-center space-x-2">
          <Button
            size="medium"
            onClick={closeCreateComponent}
            variant="contained"
            disabled={loading}
            color="secondary"
            className=" bg-gradient-to-r  hover:from- hover:to- shadow-lg"
          >
            <i className="tabler-x mr-1 text-[18px] "></i>
            {dic?.cancel}
          </Button>

          <Button
            onClick={onCreateRoom}
            variant="contained"
            disabled={
              loading ||
              !name ||
              !zoneId ||
              !roomAreaCategoryId ||
              !wide ||
              !long ||
              !moreArea ||
              !amount ||
              !centralAmount
            }
            size="medium"
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full w-5 border-2 border-white border-t-transparent mr-2"></div>
                {dic?.creating}
              </>
            ) : (
              <>
                <i className="tabler-device-floppy mr-2 text-[18px]"></i>
                {dic?.save}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
