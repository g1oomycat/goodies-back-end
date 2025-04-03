"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSkipAndPage = void 0;
const GetSkipAndPage = (page, limit) => {
    return page && page > 0 && limit && limit > 0
        ? {
            take: limit,
            skip: (page - 1) * limit,
        }
        : {
            take: 1000000,
            skip: 0,
        };
};
exports.GetSkipAndPage = GetSkipAndPage;
//# sourceMappingURL=get-skip-and-take.js.map