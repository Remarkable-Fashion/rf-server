export function createYearMonthString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const result = `${year}-${month}`;

    return result;
}
