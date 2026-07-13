// "use client";

// import { useMemo, useCallback } from "react";
// import {Card,CardContent,Typography,Grid,Box,RadioGroup,FormControlLabel,Radio,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,Collapse,MenuItem,} from "@mui/material";
// import CustomTextField from "@core/components/mui/TextField";
// import {DocumentTypeDropdown,ShopCategoryDropdown,RoomStatusDropdown,CurrencyDropdown,} from "@core/components/custom-inputs";

// export interface ContractInfoTemplateProps {
//   // Contract Basic Info
//   contractNumber: string;
//   onContractNumberChange: (value: string) => void;

//   // Document Type
//   List: any[];
//   documentTypeId: string;
//   onDocumentTypeChange: (value: string) => void;

//   // Shop Information
//   shopName: string;
//   onShopNameChange: (value: string) => void;
//   shopCategoryList: any[];
//   shopCategoryId: string;
//   onShopCategoryChange: (value: string) => void;

//   // Status & Dates
//   roomStatusList: any[];
//   selected: string;
//   onRoomStatusChange: (value: string) => void;
//   startDate: string;
//   onStartDateChange: (value: string) => void;
//   endDate: string;
//   onEndDateChange: (value: string) => void;
//   billingEndDate: string;
//   onBillingEndDateChange: (value: string) => void;

//   // Payment Type
//   paymentType: "monthly" | "period";
//   onPaymentTypeChange: (value: "monthly" | "period") => void;

//   // Payment Periods (only when paymentType === 'period')
//   paymentPeriods?: any[];
//   onAddPaymentPeriod?: () => void;
//   onUpdatePaymentPeriod?: (index: number, field: string, value: any) => void;
//   onRemovePaymentPeriod?: (index: number) => void;

//   // Room Selection
//   rooms?: any[];
//   onAddRoom?: () => void;
//   onUpdateRoom?: (index: number, field: string, value: any) => void;
//   onRemoveRoom?: (index: number) => void;
//   roomOptions?: any[];

//   // Currency List
//   currencyList?: any[];

//   // File Upload
//   attachedContract: File[];
//   onContractFileChange: (files: File[]) => void;

//   // Loading states
//   loading?: boolean;

//   // Dictionary for translations
//   dic?: any;
// }

// export const ContractInfoTemplate = ({
//   contractNumber,
//   onContractNumberChange,
//   List,
//   documentTypeId,
//   onDocumentTypeChange,
//   shopName,
//   onShopNameChange,
//   shopCategoryList,
//   shopCategoryId,
//   onShopCategoryChange,
//   roomStatusList,
//   selected,
//   onRoomStatusChange,
//   startDate,
//   onStartDateChange,
//   endDate,
//   onEndDateChange,
//   billingEndDate,
//   onBillingEndDateChange,
//   paymentType,
//   onPaymentTypeChange,
//   paymentPeriods,
//   onAddPaymentPeriod,
//   onUpdatePaymentPeriod,
//   onRemovePaymentPeriod,
//   rooms,
//   onAddRoom,
//   onUpdateRoom,
//   onRemoveRoom,
//   roomOptions,
//   currencyList,
//   attachedContract,
//   onContractFileChange,
//   loading = false,
//   dic,
// }: ContractInfoTemplateProps) => {
  
//   // Memoized values
//   const fileDisplayText = useMemo(() => {
//     if (attachedContract.length === 0) return "ເລືອກໄຟລ໌...";
//     if (attachedContract.length === 1) return attachedContract[0].name;
//     return `${attachedContract.length} ໄຟລ໌ທີ່ເລືອກ`;
//   }, [attachedContract]);

//   const hasPaymentPeriods = useMemo(() => {
//     return paymentPeriods && paymentPeriods.length > 0;
//   }, [paymentPeriods]);

//   // Callback handlers
//   const handleContractFileChange = useCallback((files: File[]) => {
//     onContractFileChange(files);
//   }, [onContractFileChange]);

//   const handlePaymentTypeChange = useCallback((value: "monthly" | "period") => {
//     onPaymentTypeChange(value);
//   }, [onPaymentTypeChange]);

//   const handleAddPaymentPeriod = useCallback(() => {
//     onAddPaymentPeriod?.();
//   }, [onAddPaymentPeriod]);

//   const handleUpdatePaymentPeriod = useCallback((index: number, field: string, value: any) => {
//     onUpdatePaymentPeriod?.(index, field, value);
//   }, [onUpdatePaymentPeriod]);

//   const handleRemovePaymentPeriod = useCallback((index: number) => {
//     onRemovePaymentPeriod?.(index);
//   }, [onRemovePaymentPeriod]);
//   return (
//     <Card sx={{ mb: 3 }}>
//       <CardContent>
//         <Typography
//           variant="h6"
//           sx={{ mb: 3, display: "flex", alignItems: "center" }}
//         >
//           ຂໍ້ມູນສັນຍາ
//         </Typography>

//         <Grid container spacing={3}>
//           {/* Contract Number */}
//           <Grid item xs={12} md={3}>
//             <CustomTextField fullWidth label={dic?.contractNumber} value={contractNumber} onChange={(e) => onContractNumberChange(e.target.value)} disabled={loading} />
//           </Grid>

//           {/* Document Type */}
//           <Grid item xs={12} md={3}>
//             <DocumentTypeDropdown selectedDocumentTypeId={documentTypeId} onDocumentTypeChange={onDocumentTypeChange} loading={loading} required={false} label={dic?.documentType} />
//           </Grid>

//           {/* Shop Name */}
//           <Grid item xs={12} md={3}>
//             <CustomTextField fullWidth label={dic?.shopName} value={shopName} onChange={(e) => onShopNameChange(e.target.value)} disabled={loading} />
//           </Grid>

//           {/* Shop Category */}
//           <Grid item xs={12} md={3}>
//             <ShopCategoryDropdown selectedShopCategoryId={shopCategoryId} onShopCategoryChange={onShopCategoryChange} required={false} label={dic?.shopCategory} />
//           </Grid>

//           {/* Room Status */}
//           <Grid item xs={12} md={3}>
//             <RoomStatusDropdown selected={selected} onRoomStatusChange={onRoomStatusChange} loading={loading} required={false} label={dic?.roomStatus} />
//           </Grid>

//           {/* Start Date */}
//           <Grid item xs={12} md={3}>
//             <CustomTextField fullWidth type="date" label={dic?.startDate} value={startDate} onChange={(e) => onStartDateChange(e.target.value)} disabled={loading} InputLabelProps={{ shrink: true }} />
//           </Grid>

//           {/* End Date */}
//           <Grid item xs={12} md={3}>
//             <CustomTextField
//               fullWidth
//               type="date"
//               label={dic?.endDate}
//               value={endDate}
//               onChange={(e) => onEndDateChange(e.target.value)}
//               disabled={loading}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           {/* Billing End Date */}
//           <Grid item xs={12} md={3}>
//             <CustomTextField
//               fullWidth
//               type="date"
//               label={dic?.billingEndDate}
//               value={billingEndDate}
//               onChange={(e) => onBillingEndDateChange(e.target.value)}
//               disabled={loading}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           {/* File Upload - Moved after billing end date */}
//           <Grid item xs={12}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               📎 ແນບສັນຍາ
//             </Typography>
//             <Box>
//               <input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={(e) => {
//                  const files = Array.from(e.target.files || []);
//                  handleContractFileChange(files);
//                 }}
//                 style={{ display: "none" }}
//                 id="contract-file-upload"
//                 disabled={loading}
//               />
//               <label htmlFor="contract-file-upload"
//                 style={{ cursor: "pointer" }}
//               >
//                 <Typography variant="body1" sx={{ mb: 1 }}>
//                   ເລືອກໄຟລ์ສັນຍາ
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   ຮອງຮັບ: JPG, PNG, PDF, DOC, DOCX
//                 </Typography>
//               </label>

//               {attachedContract && attachedContract.length > 0 && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="subtitle2">
//                     ໄຟລ์ທີ່ເລືອກ ({attachedContract.length} ໄຟລ໌):
//                   </Typography>
//                   {attachedContract.map((file, index) => (
//                     <Typography key={index} variant="body2" sx={{ mt: 1 }}>
//                       📄 {file.name} ({Math.round(file.size / 1024)} KB)
//                     </Typography>
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           </Grid>

//           {/* Payment Type */}
//           <Grid item xs={12} sx={{ mt: 2 }}>
//             {/* <Typography variant="subtitle1" sx={{ mb: 2 }}>
//               💰 ປະເພດການຊຳລະ
//             </Typography> */}
//             <RadioGroup
//               value={paymentType}
//               onChange={(e) =>
//                 handlePaymentTypeChange(e.target.value as "monthly" | "period")
//               }
//               row
//             >
//               <FormControlLabel value="monthly" control={<Radio />} label="ຊຳລະລາຍເດືອນ" disabled={loading} />
//               <FormControlLabel value="period" control={<Radio />} label="ຊຳລະເປັນງວດ" disabled={loading} />
//             </RadioGroup>
//           </Grid>

//           {/* Payment Periods Management - Only show when paymentType is 'period' */}
//           <Grid item xs={12}>
//             <Collapse in={paymentType === "period"}>
//               <Box sx={{ mt: 2 }}>
//                 {/* Payment Periods Table - Always show when period type is selected */}
//                 <TableContainer
//                   component={Paper}
//                   sx={{
//                     borderRadius: 2,
//                     border: "1px solid #e0e0e0",
//                     "& .MuiTableCell-root": {
//                       borderRight: "1px solid #e0e0e0",
//                       "&:last-child": {
//                         borderRight: "none",
//                       },
//                     },
//                   }}
//                 >
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                         <TableCell sx={{ fontWeight: "bold", textAlign: "center", width: "8%", padding: "6px" }}>ລຳດັບ</TableCell>
//                         <TableCell sx={{ fontWeight: "bold", textAlign: "center", width: "30%", padding: "6px" }}>ລາຍລະອຽດ</TableCell>
//                         <TableCell sx={{ fontWeight: "bold", textAlign: "center", width: "20%", padding: "6px" }}>ຈຳນວນເງິນ</TableCell>
//                         <TableCell sx={{ fontWeight: "bold", textAlign: "center", width: "15%", padding: "6px" }}>ສະກຸນເງິນ</TableCell>
//                         <TableCell sx={{ fontWeight: "bold", textAlign: "center", width: "20%", padding: "6px" }}>ວັນທີ່ຈ່າຍ</TableCell>
//                         <TableCell sx={{ fontWeight: "bold", textAlign: "center", width: "7%", padding: "6px" }}>ຈັດການ</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {/* Always show at least one row for adding */}
//                       {hasPaymentPeriods ? (
//                         paymentPeriods!.map((period, index) => (
//                           <TableRow
//                             key={period.id || index}
//                             sx={{
//                               "&:hover": { backgroundColor: "#f9f9f9" },
//                               height: "48px",
//                             }}
//                           >
//                             <TableCell sx={{ textAlign: "center", padding: "6px" }}>{index + 1}</TableCell>
//                             <TableCell sx={{ padding: "6px" }}>
//                               <CustomTextField size="small" value={period.description || ""} onChange={(e) => handleUpdatePaymentPeriod(index, "description", e.target.value)} placeholder="ລາຍລະອຽດ" fullWidth />
//                             </TableCell>
//                             <TableCell sx={{ padding: "6px" }}>
//                               <CustomTextField size="small" type="text" value={period.amount ? Number(period.amount).toLocaleString() : ""} onChange={(e) => { const numericValue = e.target.value.replace(/,/g, ""); if (!isNaN(Number(numericValue)) || numericValue === "") { handleUpdatePaymentPeriod(index, "amount", Number(numericValue) || 0); } }} placeholder="ຈຳນວນເງິນ" fullWidth />
//                             </TableCell>
//                             <TableCell sx={{ padding: "6px" }}>
//                               <CurrencyDropdown currencyList={currencyList || []} selectedCurrencyId={period.currencyId || ""} onChange={(currencyId) => handleUpdatePaymentPeriod(index, "currencyId", currencyId)} label="ສະກຸນເງິນ" fullWidth />
//                             </TableCell>
//                             <TableCell sx={{ padding: "6px" }}>
//                               <CustomTextField size="small" type="date" value={period.dueDate || ""} onChange={(e) => handleUpdatePaymentPeriod(index, "dueDate", e.target.value)} InputLabelProps={{ shrink: true }} placeholder="mm/dd/yyyy" fullWidth inputProps={{ pattern: "\\d{2}/\\d{2}/\\d{4}" }} />
//                             </TableCell>
//                             <TableCell sx={{ textAlign: "center", padding: "6px" }}>
//                               {index === 0 ? (
//                                 <IconButton size="small" onClick={handleAddPaymentPeriod} sx={{ color: "#2e7d32", "&:hover": { color: "#1b5e20", backgroundColor: "rgba(46, 125, 50, 0.04)" } }}>
//                                   <i className="tabler-plus" style={{ fontSize: "16px" }} />
//                                 </IconButton>
//                               ) : (
//                                 <IconButton size="small" onClick={() => handleRemovePaymentPeriod(index)} disabled={loading}>
//                                   <i className="tabler-trash" style={{ fontSize: "16px" }} />
//                                 </IconButton>
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow sx={{ height: "48px" }}>
//                           <TableCell sx={{ textAlign: "center", padding: "6px" }}>1</TableCell>
//                           <TableCell sx={{ padding: "6px" }}><CustomTextField size="small" placeholder="ລາຍລະອຽດ" fullWidth /></TableCell>
//                           <TableCell sx={{ padding: "6px" }}><CustomTextField size="small" type="number" placeholder="ຈຳນວນເງິນ" inputProps={{ min: 0 }} fullWidth /></TableCell>
//                           <TableCell sx={{ padding: "6px" }}><CustomTextField size="small" select placeholder="ສະກຸນເງິນ" fullWidth><MenuItem value="LAK">LAK</MenuItem><MenuItem value="USD">USD</MenuItem><MenuItem value="THB">THB</MenuItem></CustomTextField></TableCell>
//                           <TableCell sx={{ padding: "6px" }}><CustomTextField size="small" type="date" InputLabelProps={{ shrink: true }} fullWidth /></TableCell>
//                           <TableCell sx={{ textAlign: "center", padding: "6px" }}><IconButton size="small" onClick={handleAddPaymentPeriod} disabled={loading}><i className="tabler-plus" style={{ fontSize: "16px" }} /></IconButton></TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Box>
//             </Collapse>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default ContractInfoTemplate;
