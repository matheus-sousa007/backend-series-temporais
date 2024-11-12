export const splitTimestamp = (timestamp: string) => {
    const TimestampRegex = /[0-9]+/g
    const result = timestamp.match(TimestampRegex) as Array<any>;

    // console.log(`result: ${JSON.stringify(result)}`)
    return {
        year: result[0],
        month: result[1],
        day: result[2],
        hour: result[3],
        minutes: result[4],
        seconds: result[5]
    }
}