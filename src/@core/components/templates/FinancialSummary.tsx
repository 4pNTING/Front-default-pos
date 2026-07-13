// // FinancialSummaryTemplate.tsx
// import React from 'react';
// import { Card, CardContent, Typography, Grid, Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
// import CustomTextField from '@core/components/mui/TextField';
// import { CurrencyDropdown } from '@core/components/custom-inputs';
// import { formatNumber, formatCurrency } from '../../../utils/formatUtils';

// export interface FinancialSummaryTemplateProps {
//   // Room Financial Data
//   totalRent: number;
//   onTotalRentChange: (value: number) => void;
//   totalUtilities: number;
//   onTotalUtilitiesChange: (value: number) => void;
  
//   // Discounts and Fees
//   rentDiscount: number;
//   onRentDiscountChange: (value: number) => void;
//   serviceDiscount: number;
//   onServiceDiscountChange: (value: number) => void;
//   Deposit: number;
//   onDepositChange: (value: number) => void;
  
//   // Currency
//   currencyList: any[];
//   currencyId: string;
//   onChange: (value: string) => void;
  
//   // Grand Total
//   grandTotal: number;
//   onGrandTotalChange: (value: number) => void;
  
//   // Room Details for breakdown
//   rooms: any[];
  
//   // Payment Type and Periods
//   paymentType?: 'monthly' | 'period';
//   paymentPeriods?: any[];
//   onAddPaymentPeriod?: () => void;
//   onUpdatePaymentPeriod?: (index: number, field: string, value: any) => void;
//   onRemovePaymentPeriod?: (index: number) => void;
  
//   // Loading states
//   loading?: boolean;
  
//   // Dictionary for translations
//   dic?: any;
// }

// const FinancialSummaryTemplate: React.FC<FinancialSummaryTemplateProps> = ({
//   totalRent,
//   onTotalRentChange,
//   totalUtilities,
//   onTotalUtilitiesChange,
//   rentDiscount,
//   onRentDiscountChange,
//   serviceDiscount,
//   onServiceDiscountChange,
//   Deposit,
//   onDepositChange,
//   currencyList,
//   currencyId,
//   onChange,
//   grandTotal,
//   onGrandTotalChange,
//   rooms,
//   paymentType,
//   paymentPeriods = [],
//   onAddPaymentPeriod,
//   onUpdatePaymentPeriod,
//   onRemovePaymentPeriod,
//   loading = false,
//   dic
// }) => {
  


//   // Format number for input display with thousand separators
//   const formatInputNumber = (value: number, hideZero: boolean = false) => {
//     if (!value && value !== 0) return '';
//     if (hideZero && value === 0) return '';
//     return new Intl.NumberFormat('en-US').format(value);
//   };

//   // Parse formatted number back to number
//   const parseInputNumber = (value: string) => {
//     return Number(value.replace(/,/g, '')) || 0;
//   };

//   // Common styles for number inputs (no steppers + better appearance)
//   const numberInputStyles = {
//     '& input[type=number]': {
//       '-moz-appearance': 'textfield'
//     },
//     '& input[type=number]::-webkit-outer-spin-button': {
//       '-webkit-appearance': 'none',
//       margin: 0
//     },
//     '& input[type=number]::-webkit-inner-spin-button': {
//       '-webkit-appearance': 'none',
//       margin: 0
//     },
//     '& .MuiOutlinedInput-root': {
//       backgroundColor: '#fafafa',
//       '&:hover': {
//         backgroundColor: '#f5f5f5',
//       },
//       '&.Mui-focused': {
//         backgroundColor: '#fff',
//       }
//     }
//   };

//   return (
//     <Card sx={{ mb: 3 }}>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           ສະຫຼຸບທາງການເງິນ
//         </Typography>

//         <Grid container spacing={3}>
//           {/* First Row: Total Rent, Total Utilities, Rent Discount, Service Discount */}
//           <Grid item xs={12} md={3}>
//             <CustomTextField
//               fullWidth
//               type="text"
//               label="ຄ່າເຊົ່າລວມ"
//               value={formatInputNumber(totalRent)}
//               onChange={(e) => onTotalRentChange(parseInputNumber(e.target.value))}
//               sx={numberInputStyles}
//               placeholder="0"
//             />
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <CustomTextField
//               fullWidth
//               type="text"
//               label="ຄ່າສ່ວນກາງລວມ"
//               value={formatInputNumber(totalUtilities)}
//               onChange={(e) => onTotalUtilitiesChange(parseInputNumber(e.target.value))}
//               sx={numberInputStyles}
//               placeholder="0"
//             />
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <CustomTextField
//               fullWidth
//               type="text"
//               label="ສ່ວນຫຼຸດຄ່າເຊົ່າ"
//               value={formatInputNumber(rentDiscount, true)}
//               onChange={(e) => onRentDiscountChange(parseInputNumber(e.target.value))}
//               sx={numberInputStyles}
//               placeholder=""
//             />
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <CustomTextField
//               fullWidth
//               type="text"
//               label="ສ່ວນຫຼຸດຄ່າບໍລິການ"
//               value={formatInputNumber(serviceDiscount, true)}
//               onChange={(e) => onServiceDiscountChange(parseInputNumber(e.target.value))}
//               sx={numberInputStyles}
//               placeholder=""
//             />
//           </Grid>

//           {/* Second Row: Insurance Fee, Currency Selection, (2 empty spaces) */}
//           <Grid item xs={12} md={3}>
//             <CustomTextField
//               fullWidth
//               type="text"
//               label="ເງິນມັດຈຳ"
//               value={formatInputNumber(Deposit, true)}
//               onChange={(e) => onDepositChange(parseInputNumber(e.target.value))}
//               sx={numberInputStyles}
//               placeholder=""
//             />
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <CurrencyDropdown
//               currencyList={currencyList}
//               selectedCurrencyId={currencyId}
//               onChange={onChange}
//               required={false}
//               label="ສະກຸນເງິນ"
//             />
//           </Grid>

//           {/* Grand Total */}
//           <Grid item xs={12} md={6}>
//             <CustomTextField
//               fullWidth
//               type="text"
//               label="ຈຳນວນເງິນລວມທັງໝົດ"
//               value={formatInputNumber(grandTotal)}
//               onChange={(e) => onGrandTotalChange(parseInputNumber(e.target.value))}
//               placeholder=""
//             />
//           </Grid>

      
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default FinancialSummaryTemplate;
