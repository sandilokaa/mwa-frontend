import { 
    eachWeekOfInterval, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek,
} from "date-fns";

export interface WeekData {
    label: string;
    start: Date;
    end: Date;
}

export interface MonthYearData {
    year: number;
    month: number;
    weeks: WeekData[];
}

export interface SchedulePosition {
    left: number;
    width: number;
    startIndex: number;
    endIndex: number;
}

export interface ScheduleWithPosition {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schedule: any;
    position: SchedulePosition;
    layer: number;
}

export const MONTH_NAMES = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

export const TIMELINE_CONFIG = {
    cellWidth: 70,
    picColumnWidth: 180,
    baseRowHeight: 60,
    scheduleItemHeight: 45,
    scheduleSpacing: 4,
    headerHeight: 100,
};

/**
 * Generate weeks for a specific month and year
 */
export const generateWeeks = (year: number, month: number): WeekData[] => {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(new Date(year, month));
    const weeksInMonth = eachWeekOfInterval({ start: monthStart, end: monthEnd });

    const result: WeekData[] = [];

    for (let i = 0; i < weeksInMonth.length; i++) {
        const weekStart = startOfWeek(weeksInMonth[i]);
        let weekEnd: Date;

        if (i < 3) {
            weekEnd = new Date(Math.min(
                endOfWeek(weeksInMonth[i]).getTime(),
                monthEnd.getTime()
            ));
        } else {
            weekEnd = monthEnd;
        }

        result.push({
            label: `W${i + 1}`, 
            start: weekStart, 
            end: weekEnd
        });

        if (weekEnd.getTime() === monthEnd.getTime()) {
            break;
        }
    }
    
    return result;
};

export const generateMonthYearData = (startYear: number = 2024, yearCount: number = 11): MonthYearData[] => {
    const years = Array.from({length: yearCount}, (_, i) => startYear + i);
    
    return years.flatMap(year => 
        MONTH_NAMES.map((_, monthIndex) => ({
            year,
            month: monthIndex,
            weeks: generateWeeks(year, monthIndex)
        }))
    );
};

export const getCurrentWeekPosition = (monthYearData: MonthYearData[]): number | null => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    let weekIndex = 0;
    let found = false;
    
    for (let i = 0; i < monthYearData.length && !found; i++) {
        const yearData = monthYearData[i];
        if (yearData.year === currentYear && yearData.month === currentMonth) {
            for (let j = 0; j < yearData.weeks.length; j++) {
                const week = yearData.weeks[j];
                if (today >= week.start && today <= week.end) {
                    weekIndex = i * 4 + j;
                    found = true;
                    break;
                }
            }
        } else if (yearData.year < currentYear || 
            (yearData.year === currentYear && yearData.month < currentMonth)) {
            weekIndex += yearData.weeks.length;
        }
    }
    
    if (found) {
        const centerPosition = (weekIndex * TIMELINE_CONFIG.cellWidth) + (TIMELINE_CONFIG.cellWidth / 2);
        return centerPosition;
    }
    
    return null;
};