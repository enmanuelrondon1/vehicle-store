export const formatNumericValue = (value: number | undefined): string => {
  return value !== undefined ? value.toLocaleString("es-VE") : "";
};

export const formatPriceVes = (price: number | undefined, exchangeRate: number | null): string | null => {
    if (price && exchangeRate) {
      return (price * exchangeRate).toLocaleString("es-VE", {
        style: "currency",
        currency: "VES",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return null;
};