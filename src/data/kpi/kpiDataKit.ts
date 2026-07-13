function createData(
    range: string,
    percent: number,
) {
    return { range, percent };
}

export const salaryDataKit = [
    createData('1-40', 0),
    createData('41-50', 5),
    createData('51-60', 6),
    createData('61-70', 7),
    createData('71-80', 8),
    createData('81-90', 9),
    createData('91-100', 10),
];