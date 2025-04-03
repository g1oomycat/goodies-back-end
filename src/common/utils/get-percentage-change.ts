export const GetPercentageChange = (newPrice: number, oldPrice: number) =>
  Math.round(((newPrice - oldPrice) / oldPrice) * 100);
