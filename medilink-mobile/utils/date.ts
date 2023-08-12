export const getHealthStartDateOption = (): string => {
    const date = new Date();
    date.setTime(date.getTime() - 60 * 86400 * 1000);

    return date.toISOString();
};

export const getHealthEndDateOption = (): string => {
    const date = new Date();
    return date.toISOString();
};
