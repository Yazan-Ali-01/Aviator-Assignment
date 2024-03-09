"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNumber = void 0;
function isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
exports.isValidNumber = isValidNumber;
