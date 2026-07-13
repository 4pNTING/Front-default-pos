import { SortingState } from "@tanstack/react-table";

// Type for sort order
export type SortOrder = 'ASC' | 'DESC' | null;

/**
 * Initialize sorting state from store values
 * @param sortField - Current sort field from store
 * @param sortOrder - Current sort order from store
 * @param columnToSortFieldMap - Mapping of column IDs to sort field enum values
 * @returns SortingState for react-table
 */
export function initializeSortingState<T extends string>(
    sortField: T | null,
    sortOrder: SortOrder,
    columnToSortFieldMap: Record<string, T>
): SortingState {
    if (sortField && sortOrder) {
        const columnId = Object.keys(columnToSortFieldMap).find(
            key => columnToSortFieldMap[key] === sortField
        );
        if (columnId) {
            return [{ id: columnId, desc: sortOrder === 'DESC' }];
        }
    }
    return [];
}

/**
 * Create a sorting change handler function
 * @param options - Configuration options for the handler
 * @returns Async function to handle sorting changes
 */
export function createSortingChangeHandler<T extends string>(options: {
    columnToSortFieldMap: Record<string, T>;
    setSortingState: (sorting: SortingState) => void;
    setSorting: (field: T | null, order: SortOrder) => void;
    loadAPI: () => Promise<void>;
    onError?: (error: any) => void;
}) {
    return async (newSorting: SortingState) => {
        const { columnToSortFieldMap, setSortingState, setSorting, loadAPI, onError } = options;
        setSortingState(newSorting);

        try {
            if (newSorting.length > 0) {
                const { id, desc } = newSorting[0];
                const enumValue = columnToSortFieldMap[id];
                if (enumValue) {
                    setSorting(enumValue, desc ? 'DESC' : 'ASC');
                    await loadAPI();
                }
            } else {
                setSorting(null, null);
                await loadAPI();
            }
        } catch (error: any) {
            if (onError) {
                onError(error);
            }
        }
    };
}
