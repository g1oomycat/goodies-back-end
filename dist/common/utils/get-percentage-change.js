"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPercentageChange = void 0;
const GetPercentageChange = (newPrice, oldPrice) => Math.round(((newPrice - oldPrice) / oldPrice) * 100);
exports.GetPercentageChange = GetPercentageChange;
//# sourceMappingURL=get-percentage-change.js.map