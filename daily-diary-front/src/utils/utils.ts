export const convertDateToFormat = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {};

    if (format.includes("MMMM")) options.month = "long";
    else if (format.includes("MMM")) options.month = "short";
    else if (format.includes("MM")) options.month = "2-digit";

    if (format.includes("dd")) options.day = "2-digit";
    if (format.includes("yyyy")) options.year = "numeric";

    return new Intl.DateTimeFormat("en-US", options).format(date);
};
