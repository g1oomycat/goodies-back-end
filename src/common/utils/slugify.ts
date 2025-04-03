import { BadRequestException } from '@nestjs/common';

export function slugify(text: string): string {
  const cyrillicToLatinMap: { [key: string]: string } = {
    // Русские символы
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'E',
    Ж: 'Zh',
    З: 'Z',
    И: 'I',
    Й: 'Y',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'Kh',
    Ц: 'Ts',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Shch',
    Ы: 'Y',
    Э: 'E',
    Ю: 'Yu',
    Я: 'Ya',
    Ъ: '',
    Ь: '',
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ы: 'y',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ъ: '',
    ь: '',
    // Казахские символы
    Ә: 'A',
    Ғ: 'G',
    Қ: 'K',
    Ң: 'N',
    Ө: 'O',
    Ұ: 'U',
    Ү: 'U',
    Һ: 'H',
    І: 'I',
    ә: 'a',
    ғ: 'g',
    қ: 'k',
    ң: 'n',
    ө: 'o',
    ұ: 'u',
    ү: 'u',
    һ: 'h',
    і: 'i',
  };

  // Функция для замены символов
  const transliterate = (str: string): string => {
    return str
      .split('')
      .map((char) => cyrillicToLatinMap[char] || char)
      .join('');
  };

  const currentText = transliterate(text)
    .normalize('NFD') // Нормализуем строку
    .replace(/[\u0300-\u036f]/g, '') // Удаляем диакритические знаки
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Удаляем все, кроме букв, цифр, пробелов и дефисов
    .trim() // Удаляем пробелы в начале и в конце строки
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .toLowerCase();

  if (!currentText) {
    throw new BadRequestException('Slug не должен быть пустым');
  }
  return currentText;
}
