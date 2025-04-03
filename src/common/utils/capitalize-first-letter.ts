export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str; // Проверяем, не пустая ли строка
  return str.charAt(0).toUpperCase() + str.slice(1);
};
