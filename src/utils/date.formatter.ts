export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const year = date.getFullYear(); // Full year
    const month = monthNames[date.getMonth()]; // Get full month name
    const day = String(date.getDate()).padStart(2, "0");

    return `${month} ${day}, ${year}`;
};
