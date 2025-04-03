"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
const common_1 = require("@nestjs/common");
function slugify(text) {
    const cyrillicToLatinMap = {
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
    const transliterate = (str) => {
        return str
            .split('')
            .map((char) => cyrillicToLatinMap[char] || char)
            .join('');
    };
    const currentText = transliterate(text)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
    if (!currentText) {
        throw new common_1.BadRequestException('Slug не должен быть пустым');
    }
    return currentText;
}
//# sourceMappingURL=slugify.js.map