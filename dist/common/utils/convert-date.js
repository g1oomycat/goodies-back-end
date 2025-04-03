"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDate = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const convertToDate = (dateInput) => {
    if (dateInput instanceof Date) {
        return dateInput;
    }
    if (typeof dateInput === 'number') {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Некорректная дата');
        }
        return date;
    }
    if (typeof dateInput === 'string') {
        if (dateInput === '') {
            return;
        }
        const isoDate = (0, date_fns_1.parseISO)(dateInput);
        console.log();
        if (!isNaN(isoDate.getTime())) {
            return isoDate;
        }
        const parsedDate = (0, date_fns_1.parse)(dateInput, 'dd.MM.yyyy', new Date());
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }
    }
    throw new common_1.BadRequestException('Некорректный формат даты');
};
exports.convertToDate = convertToDate;
//# sourceMappingURL=convert-date.js.map