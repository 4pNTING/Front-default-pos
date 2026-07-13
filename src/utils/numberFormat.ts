export const NumberFormatterComma = (num: number) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'decimal',
    }).format(num);
    return formattedValue;
}