import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getWeekdays = (locale: string) => {
    const weekdays = [];
    const daysInWeek = 5;

    for (let i = 0; i < daysInWeek; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i + 2); // 2 is added to start from Monday
        weekdays.push({
            index: i,
            long: date.toLocaleDateString(locale, { weekday: "long" }),
        });
    }

    return weekdays;
};

export const days = getWeekdays("en-US");
