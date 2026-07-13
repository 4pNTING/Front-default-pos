import { FilterKeyValue, FilterModel } from "@/types/filterTypes";

export function cleanFilter<T>(obj: T): T | null {
    if (obj === null || obj === undefined) {
        return null;
    }

    if (Array.isArray(obj)) {
        return obj
            .map((item) => cleanFilter(item))
            .filter((item) => item !== null && item !== undefined) as T;
    }

    if (typeof obj === "object") {
        const cleanedObject = Object.fromEntries(
            Object.entries(obj)
                .filter(([, value]) => value !== null && value !== undefined)
                .map(([key, value]) => [key, cleanFilter(value)])
        );

        if ("field" in cleanedObject && !("value" in cleanedObject)) {
            return null;
        }
        return isEmptyObject(cleanedObject) ? null : (cleanedObject as T);
    }

    return obj;
}

function isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0;
}

export function normalizeFilterModel(input: any): FilterModel {
    const normalized = { ...input };
    if (normalized?.condition && typeof normalized?.condition === "object" && !Array.isArray(normalized?.condition)) {
        normalized.condition = Object.values(normalized?.condition);
    }
    if (normalized?.inNumber && typeof normalized?.inNumber === "object" && !Array.isArray(normalized?.inNumber)) {
        normalized.inNumber = Object.values(normalized?.inNumber);
    }
    if (normalized?.inString && typeof normalized?.inString === "object" && !Array.isArray(normalized?.inString)) {
        normalized.inString = Object.values(normalized?.inString);
    }
    if (normalized?.join && typeof normalized?.join === "object" && !Array.isArray(normalized?.join)) {
        normalized.join = Object.values(normalized?.join);
    }

    return normalized as FilterModel;
}


function mergeObjects(obj1: FilterKeyValue[], obj2: FilterKeyValue[]) {
    const merged = [...obj1];
    obj2.forEach(item2 => {
        const index = merged.findIndex(item1 => item1.field === item2.field);

        if (index !== -1) {
            merged[index] = { ...merged[index], ...item2 };
        } else {
            const objClean = cleanFilter(item2);
            if (objClean) merged.push(objClean);
        }
    });

    return merged;
}

export function updateFilterModel(newFilter: FilterModel, baseFilter: Partial<FilterModel>): FilterModel | null {
    const updatedModel = {
        ...baseFilter,
        ...newFilter,
        condition: mergeObjects(baseFilter?.condition ?? [], newFilter?.condition ?? [])
    };

    return cleanFilter(updatedModel);
}
