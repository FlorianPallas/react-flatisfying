export const toCurrencyString = (value: number, numeric = false) => {
  if (numeric) {
    return value.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
};

export const parseCurrencyString = (input: string) => {
  const isNegative = input.replace(/[0,.]*/, '').startsWith('-');
  const value = parseInt(input.replaceAll(/[^0-9]/g, '').padStart(3, '0'));
  return (value / 100) * (isNegative ? -1 : 1);
};
