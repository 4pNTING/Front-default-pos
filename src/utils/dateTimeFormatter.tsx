import CustomTextField from '@/@core/components/mui/TextField';
import { parseISO, format } from 'date-fns';
import React from 'react';

export const formatDateLocalUse = (date: string, type?: string) => {
    try {
        const padZero = (num: number) => {
            return num < 10 ? '0' + num : num;
        };

        const formattedDate = new Date(date).toLocaleString('en-US');
        const [datePart, timePart] = formattedDate.split(', ');
        const [month, day, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');

        const paddedDay = padZero(parseInt(day));
        const paddedMonth = padZero(parseInt(month));
        const paddedHour = padZero(parseInt(hour));
        const paddedMinute = padZero(parseInt(minute));
        const paddedSecond = padZero(parseInt(second));


        const formattedStringDate = `${paddedDay}-${paddedMonth}-${year}`;
        const formattedStringTime = `${paddedHour}:${paddedMinute}:${paddedSecond}`;
        if (type === "time") {
            return formattedStringTime;
        } else if (type === "date") {
            return formattedStringDate;
        } else {
            return `${formattedStringDate} ${formattedStringTime}`;
        }

    } catch (e) {
        return "INVALID DATE";
    }
};

export const formatDateField = (date: string): string => {
    try {
        const dateParsed = parseISO(date);
        const formattedDate = format(dateParsed, "yyyy-MM-dd'T'HH:mm");
        return formattedDate;
    } catch (error) {
        return "";
    }
}

/**
 * Convert Date | string | null to Date | null for DatePicker
 * Handles both Date objects and ISO string dates
 */
export function toDatePickerFormat(date: Date | string | null | undefined): Date | null {
    if (!date) return null;
    if (date instanceof Date) return date;
    
    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return null;
        return parsedDate;
    } catch {
        return null;
    }
}

/**
 * Convert date to ISO string format (YYYY-MM-DD) for API
 * Uses local timezone to avoid date shifting issues
 */
export function toISODateString(date: Date | string | null | undefined): string {
    if (!date) return '';
    
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        
        // Use local date to avoid timezone offset issues
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch {
        return '';
    }
}

/**
 * Format date to DD/MM/YYYY display format with leading zeros
 * @param date - Date string, Date object, or null/undefined
 * @returns Formatted date string (e.g., "01/07/2026") or "-" if invalid
 */
export function formatDateDisplay(date: Date | string | null | undefined): string {
    if (!date) return '-';
    
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '-';
        
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch {
        return '-';
    }
}

export function calculateWorkingAge(dateString: string) {
    // Parse the input date string
    const givenDate = new Date(dateString);
    const now = new Date();

    // Check if the given date is valid
    if (isNaN(givenDate.getTime())) {
        throw new Error("Invalid date format");
    }

    // Calculate the difference
    let years = now.getFullYear() - givenDate.getFullYear();
    let months = now.getMonth() - givenDate.getMonth();
    let days = now.getDate() - givenDate.getDate();

    // Adjust for negative values
    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return `${years > 0 ? `${years} ປ ` : ''}${months > 0 ? `${months} ດ` : ''}`;
}

/**
 * Custom DatePicker input component with autocomplete disabled
 */
export const DatePickerInput = React.forwardRef<HTMLInputElement, any>(
    ({ fullWidth = true, size = "small" as "small" | "medium", ...rest }, ref) => (
      <CustomTextField
        {...rest}
        inputRef={ref}
        fullWidth={fullWidth}
        size={size}
        InputProps={{ 
          ...rest.InputProps, 
          autoComplete: 'off' 
        }}
      />
    )
);