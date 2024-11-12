"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTimestamp = void 0;
const splitTimestamp = (timestamp) => {
    const TimestampRegex = /[0-9]+/g;
    const result = timestamp.match(TimestampRegex);
    // console.log(`result: ${JSON.stringify(result)}`)
    return {
        year: result[0],
        month: result[1],
        day: result[2],
        hour: result[3],
        minutes: result[4],
        seconds: result[5]
    };
};
exports.splitTimestamp = splitTimestamp;
