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
