// utils/formatUtils.ts - Number and Currency Formatting Utilities


/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted string with commas (e.g., "1,234,567")
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Format currency with number and currency code (without symbol)
 * @param amount - Amount to format
 * @param currencyCode - Currency code (e.g., 'LAK', 'USD', 'THB')
 * @returns Formatted string (e.g., "1,234,567 LAK")
 */
export const formatCurrency = (amount: number, currencyCode: string = ''): string => {
  const formattedAmount = formatNumber(amount);
  return currencyCode ? `${formattedAmount} ${currencyCode}` : formattedAmount;
};

/**
 * Format number input - remove non-numeric characters and format
 * @param value - Input string value
 * @returns Cleaned and formatted string
 */
/**
 * Format decimal input - keeps digits and one decimal point, adds thousand separators to integer part.
 * Useful for fields like price, width, length.
 * @param value - Input string value
 * @returns Cleaned and formatted string (e.g., "1,234.50")
 */
export const formatDecimalInput = (value: string): string => {
  // Remove all non-numeric and non-dot characters
  let cleanValue = value.replace(/[^0-9.]/g, '');

  // Ensure only one decimal point exists
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    cleanValue = parts[0] + '.' + parts.slice(1).join('');
  }

  // Format the integer part with commas
  let [integer, decimal] = cleanValue.split('.');
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decimal !== undefined ? `${integer}.${decimal}` : integer;
};

/**
 * Parse a string with commas and decimals back to a number safely.
 * @param value - Formatted string (e.g., "1,234.50")
 * @returns Numeric value
 */
export const parseDecimalNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleanValue = value.toString().replace(/,/g, '');
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Parse formatted number string back to number
 * @param value - Formatted string (e.g., "1,234,567")
 * @returns Number value
 */
export const parseFormattedNumber = (value: string): number => {
  const cleanValue = value.replace(/,/g, '');
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Format decimal places
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number with specified decimal places
 */
export const formatDecimal = (num: number, decimals: number = 2): string => {
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
};

/**
 * Format number for input display with thousand separators
 * @param value - Number to format
 * @param hideZero - Whether to hide zero values (default: false)
 * @returns Formatted string with commas or empty string
 */
export const formatInputNumber = (value: number, hideZero: boolean = false): string => {
  if (!value && value !== 0) return '';
  if (hideZero && value === 0) return '';
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Parse formatted number back to number
 * @param value - Formatted string (e.g., "1,234,567")
 * @returns Number value
 */
export const parseInputNumber = (value: string): number => {
  return Number(value.replace(/,/g, '')) || 0;
};

export function formatAmount(amount: number): string {
  if (!amount) return '-';
  return amount.toLocaleString();
}

