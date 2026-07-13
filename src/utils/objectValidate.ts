export const areObjectsEqual = (obj1: Record<string, any> | null | undefined, obj2: Record<string, any> | null | undefined): boolean => {
    if (obj1 === obj2) {
        return true;
    }
    if (obj1 == null || obj2 == null) {
        return false;
    }
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};


export const areObjectsEqualByKeys = (obj1: Record<string, any> | null | undefined, obj2: Record<string, any> | null | undefined): boolean => {
    if (!obj1 || !obj2) {
        return false;
    }

    return Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
};