"use client"

import { useRef, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { Schedule } from "@/store/slice/schedule/getAllSlice";
import { fetchFilteredSchedule } from "@/store/slice/schedule/getAllSlice";
import { 
    eachWeekOfInterval, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek,
    differenceInDays,
} from "date-fns";

export default function DashboardCalendar() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();

    const currentWeekRef = useRef<HTMLDivElement | null>(null);
    const [lineLeft, setLineLeft] = useState<number | null>(null);
    const [monthYearData, setMonthYearData] = useState<Array<{year: number, month: number, weeks: Array<{label: string, start: Date, end: Date}>}>>([]);
    
    const generateWeeks = (year: number, month: number) => {
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));
        const weeksInMonth = eachWeekOfInterval({ start, end });

        const result: {label: string, start: Date, end: Date}[] = [];

        for (let i = 0; i < weeksInMonth.length; i++) {
            const weekStart = startOfWeek(weeksInMonth[i]);

            if (i < 3) {
                const weekEnd = endOfWeek(weeksInMonth[i]);
                result.push({label: `W${i + 1}`, start: weekStart, end: weekEnd});
            } else if (i === 3) {
                const weekEnd = endOfMonth(new Date(year, month));
                result.push({label: 'W4', start: weekStart, end: weekEnd});
                break;
            }
        }
        return result;
    };

    const getCurrentWeekLabel = () => {
        const today = new Date();
        const startOfMonthToday = startOfMonth(today);
        const dayOfMonth = today.getDate();
        const weekIndex = Math.ceil(dayOfMonth / 7);
        const startOfWeekToday = startOfWeek(today);
        if (startOfWeekToday.getMonth() !== today.getMonth() && startOfWeekToday.getDate() > 20) {
            return 'W1';
        }
        
        if (weekIndex <= 3) {
            return `W${weekIndex}`;
        }
        return 'W4';
    };


    const monthNames = useMemo(() => [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ], []);

    const years = useMemo(() => Array.from({length: 11}, (_, i) => 2024 + i), []);

    useEffect(() => {
        const data = years.flatMap(year => 
            monthNames.map((_, monthIndex) => ({
                year,
                month: monthIndex,
                weeks: generateWeeks(year, monthIndex)
            }))
        );
        setMonthYearData(data);
    }, [years, monthNames]);
    
    useEffect(() => {
        if (currentWeekRef.current && currentWeekRef.current.offsetParent) {
            const el = currentWeekRef.current;
            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            const parentLeft = (el.offsetParent as HTMLElement).offsetLeft;
            const left = el.offsetLeft + el.offsetWidth / 2 - 1 + parentLeft;
            setLineLeft(left);
        }
    }, [monthYearData]);
    
    const { filteredSchedule } = useAppSelector(state => state.scheduleLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredSchedule({
                    productId: selectedProduct.id,
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id, dispatch]);

    const timelineStartDate = useMemo(() => {
        if (monthYearData.length === 0) return new Date();
        const firstMonth = monthYearData[0];
        return startOfWeek(startOfMonth(new Date(firstMonth.year, firstMonth.month)));
    }, [monthYearData]);
    
    const timelineCellWidth = 70;

    const calculateSchedulePosition = (schedule: Schedule) => {
        const startDate = new Date(schedule.startDate);
        const endDate = new Date(schedule.endDate);
        
        let startWeek: {start: Date, end: Date} | null = null;
        let endWeek: {start: Date, end: Date} | null = null;
        
        for (const yearData of monthYearData) {
            for (const week of yearData.weeks) {
                if (startDate >= week.start && startDate <= week.end) {
                    startWeek = week;
                }
                if (endDate >= week.start && endDate <= week.end) {
                    endWeek = week;
                }
            }
        }
        
        if (!startWeek || !endWeek) {
            return { left: 0, width: 0 };
        }
        
        let startIndex = 0;
        let endIndex = 0;
        let foundStart = false;
        let foundEnd = false;
        
        for (let i = 0; i < monthYearData.length; i++) {
            const yearData = monthYearData[i];
            for (let j = 0; j < yearData.weeks.length; j++) {
                const week = yearData.weeks[j];
                if (week.start.getTime() === startWeek.start.getTime() && 
                    week.end.getTime() === startWeek.end.getTime()) {
                    startIndex = i * 4 + j; // 4 weeks per month
                    foundStart = true;
                }
                if (week.start.getTime() === endWeek.start.getTime() && 
                    week.end.getTime() === endWeek.end.getTime()) {
                    endIndex = i * 4 + j;
                    foundEnd = true;
                }
            }
        }
        
        if (!foundStart || !foundEnd) {
            return { left: 0, width: 0 };
        }
        
        const left = startIndex * timelineCellWidth;
        const width = (endIndex - startIndex + 1) * timelineCellWidth;
        
        return { left, width };
    };

    const schedulesByPic = useMemo(() => {
        if (!filteredSchedule) return {};
        return filteredSchedule.reduce((acc, schedule) => {
            const { pic } = schedule;
            if (!acc[pic]) {
                acc[pic] = [];
            }
            acc[pic].push(schedule);
            return acc;
        }, {} as Record<string, Schedule[]>);
    }, [filteredSchedule]);


    return (
        <div className="flex w-full h-full bg-gray-100">
            <div className="relative overflow-x-auto p-5 bg-white rounded-lg w-full">
                <div className="flex flex-col gap-2 min-w-max sticky top-0 bg-white z-10 pb-2">
                    <div className="flex border-b border-gray-300">
                        {years.map((year) => (
                            <div key={year} className="flex">
                                {monthNames.map((month, monthIndex) => {
                                    const weeksInMonth = monthYearData.find(d => d.year === year && d.month === monthIndex)?.weeks.length || 0;
                                    return (
                                        <div key={`${year}-${month}`} className="flex flex-col items-center border-r border-gray-200 w-full" style={{width: weeksInMonth * timelineCellWidth}}>
                                            <div className="font-bold text-center w-full text-gray-700">{month} {year}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <div className="flex border-b border-gray-300">
                        {monthYearData.map(({ year, month, weeks }) => {
                            const currentWeekLabel = getCurrentWeekLabel();
                            return (
                                <div key={`${year}-${month}-weeks`} className="flex">
                                    {weeks.map((week) => {
                                        const isCurrent =
                                            year === new Date().getFullYear() &&
                                            month === new Date().getMonth() &&
                                            week.label === currentWeekLabel;

                                        return (
                                            <div
                                                ref={isCurrent ? el => { if (el) currentWeekRef.current = el; } : null}
                                                key={`${year}-${month}-${week.label}`}
                                                className={`text-sm font-medium p-1 text-center border-r border-gray-200 text-gray-500 ${isCurrent ? "bg-red-200 font-bold !text-red-800" : ""}`}
                                                style={{width: timelineCellWidth}}
                                            >
                                                {week.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="relative w-full mt-2">
                    {Object.entries(schedulesByPic).map(([pic, schedules]) => (
                        <div key={pic} className="relative h-15 flex items-center">
                            {schedules.map((schedule) => {
                                const { left, width } = calculateSchedulePosition(schedule);
                                
                                return (
                                    <div
                                        key={schedule.id}
                                        className="absolute p-2 border border-gray-300 rounded-md flex items-center justify-center"
                                        style={{
                                            left: `${left}px`,
                                            width: `${width}px`,
                                            minWidth: `${width}px`,
                                        }}
                                        // title={`${schedule.scheduleName}: ${schedule.startDate} to ${schedule.endDate}`}
                                    >
                                        <div className="text-sm text-black p-2 truncate font-medium">
                                            {schedule.scheduleName}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                
                {lineLeft !== null && (
                    <div
                        className="absolute top-[81px] bottom-0 w-[2px] bg-red-500 z-20"
                        style={{ left: `${lineLeft}px` }}
                    />
                )}
            </div>
        </div>
    );
}