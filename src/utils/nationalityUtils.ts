/**
 * Utility functions for nationality translation
 */

import { NATIONALITY_OPTIONS } from "@/data/mockup/locationData";

/**
 * Convert nationality code (English) to Lao name
 * @param code - The nationality code (e.g., "vietnamese", "lao", "chinese")
 * @returns The Lao name (e.g., "ຫວຽດນາມ", "ລາວ", "ຈີນ") or the original code if not found
 */
export const getNationalityLaoName = (code: string | undefined | null): string => {
    if (!code) return "";
    const found = NATIONALITY_OPTIONS.find(
        (opt) => opt.code.toLowerCase() === code.toLowerCase() || opt._id.toLowerCase() === code.toLowerCase()
    );
    return found?.name || code;
};
