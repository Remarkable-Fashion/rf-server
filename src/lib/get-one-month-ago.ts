export const getOneMonthAgo = (day?: Date) => {
    const date = day || new Date();

    date.setMonth(date.getMonth() - 1);

    return date;
};
