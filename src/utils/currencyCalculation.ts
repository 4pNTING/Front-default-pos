/**
 * Calculate amount based on currency type
 * LAK currency uses Math.floor, others use normal calculation
 */
export const calculateByCurrency = (amount: number, currencyId: string): number => {
  if (currencyId === "1") {
    return Math.floor(amount);
  }
  return amount;
};

/**
 * Format number for display based on currency type
 * LAK: No decimals (0 decimal places)
 * USD/THB: 2 decimal places
 */
export const formatNumberWithoutDecimals = (num: number, currencyId: string = "1"): string => {
  if (isNaN(num)) return "0";

  // LAK currency - no decimals
  if (currencyId === "1") {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // USD/THB - 2 decimal places
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
