const currencyCode = 'Rp ';
const currencyPosition: 'left' | 'right' = 'left';
const maxFractionDigits = 2;
const thousandSeparator = '.';

function position(currencyPosition: 'left' | 'right', value: string): string {
    return currencyPosition === 'left' ? `${currencyCode}${value}` : `${value}${currencyCode}`;
}

const CurrencyFormatter = (value: number | string | null | undefined): string => {
    if (value === 0 || value === null || value === undefined || value === '0') {
        return position(currencyPosition, '0');
    }

    let numericValue: number = typeof value === 'string' ? parseFloat(value) : value;

    const currencyCheck = currencyCode.replace(/\s/g, '').toLowerCase();
    if (currencyCheck === 'idr' || currencyCheck === 'rp') {
        numericValue = Math.ceil(numericValue);
    }

    const fixed = numericValue.toFixed(maxFractionDigits);
    const [integerPart, fractionalPart] = fixed.split('.');

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    const result = fractionalPart && Number(fractionalPart) > 0
        ? `${formattedInteger}${thousandSeparator}${fractionalPart}`
        : formattedInteger;

    return position(currencyPosition, result);
};

export default CurrencyFormatter;
