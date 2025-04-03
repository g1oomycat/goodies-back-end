import { BadRequestException } from '@nestjs/common';
import { parse, parseISO } from 'date-fns';

export const convertToDate = (dateInput: string | number | Date): Date => {
  if (dateInput instanceof Date) {
    return dateInput; // Уже Date, возвращаем как есть
  }

  if (typeof dateInput === 'number') {
    // Unix timestamp (миллисекунды)
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Некорректная дата');
    }
    return date;
  }

  if (typeof dateInput === 'string') {
    if (dateInput === '') {
      return;
    }
    // 1. Проверяем, является ли строка в ISO формате
    const isoDate = parseISO(dateInput);
    console.log();

    if (!isNaN(isoDate.getTime())) {
      return isoDate; // ✅ Если ISO-строка, возвращаем сразу
    }

    // 2. Парсим формат "dd.MM.yyyy"
    const parsedDate = parse(dateInput, 'dd.MM.yyyy', new Date());
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  throw new BadRequestException('Некорректный формат даты');
};
