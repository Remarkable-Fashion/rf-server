/**
 *
 * @returns 예시 `2023-06`
 */
export function createYearMonthString(day?: Date) {
    const date = day || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const result = `${year}-${month}`;

    return result;
}
