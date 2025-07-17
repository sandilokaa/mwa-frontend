"use client"

import { useRef, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { Schedule } from "@/store/slice/schedule/getAllSlice";
import { fetchFilteredSchedule } from "@/store/slice/schedule/getAllSlice";
import { deleteSchedule, resetDeleteState } from "@/store/slice/schedule/deleteSlice";
import { refetchSchedule } from "@/utils/refetch/refetchSchedule";
import { 
    eachWeekOfInterval, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek,
} from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";

import ConfirmDialog from "../common/modal/ConfirmDialog";

export default function DashboardCalendar() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { selectedProduct } = useProductFilter();

    /* --------------- Calendar --------------- */

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
        if (currentWeekRef.current) {
            const el = currentWeekRef.current;
            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            
            // Get the container element (timeline area)
            const timelineContainer = el.closest('.flex.flex-col.min-w-max');
            if (timelineContainer) {
                const containerRect = timelineContainer.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                
                // Calculate relative position within timeline
                const relativeLeft = elRect.left - containerRect.left;
                const centerPosition = relativeLeft + el.offsetWidth / 2 - 1;
                
                setLineLeft(centerPosition);
            }
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
    
    const timelineCellWidth = 70;
    const picColumnWidth = 180;
    const rowHeight = 60;

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
                    startIndex = i * 4 + j;
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

    /* --------------- End Calendar --------------- */


    /* --------------- Delete Schedule --------------- */

    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteSchedule({ id: targetId }))
                .unwrap()
                .then(() => {
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchSchedule(dispatch, selectedProduct?.id);
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* --------------- End Delete Schedule --------------- */

    const headerHeight = 100;

    return (
        <div className="w-full h-full bg-gray-50">
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Progress"
                message="Are you sure you want to delete this Progress?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative overflow-x-auto">
                    {/* Header Section */}
                    <div 
                        className="flex sticky top-0 bg-white z-30 border-b border-gray-200"
                        style={{ height: headerHeight }}
                    >
                        {/* PIC Column Header */}
                        <div 
                            className="flex-shrink-0 border-r border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 sticky left-0 z-40"
                            style={{ width: picColumnWidth }}
                        >
                            <div className="h-full flex flex-col justify-center items-center px-4">
                                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Person in Charge
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    PIC
                                </div>
                            </div>
                        </div>
                        
                        {/* Calendar Header */}
                        <div className="flex flex-col min-w-max">
                            {/* Year/Month Header */}
                            <div className="flex border-b border-gray-200 h-12">
                                {years.map((year) => (
                                    <div key={year} className="flex">
                                        {monthNames.map((month, monthIndex) => {
                                            const weeksInMonth = monthYearData.find(d => d.year === year && d.month === monthIndex)?.weeks.length || 0;
                                            return (
                                                <div 
                                                    key={`${year}-${month}`} 
                                                    className="flex items-center justify-center border-r border-gray-200 bg-gray-50" 
                                                    style={{width: weeksInMonth * timelineCellWidth}}
                                                >
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        {month} {year}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Week Header */}
                            <div className="flex h-12">
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
                                                        className={`
                                                            flex items-center justify-center border-r border-gray-200 text-xs font-medium
                                                            ${isCurrent 
                                                                ? "bg-red-100 text-red-800 font-bold" 
                                                                : "bg-white text-gray-600 hover:bg-gray-50"
                                                            }
                                                        `}
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
                    </div>

                    {/* Content Section */}
                    <div className="flex relative">
                        {/* PIC Column Content */}
                        <div 
                            className="flex-shrink-0 border-r border-gray-200 bg-white sticky left-0 z-20"
                            style={{ width: picColumnWidth }}
                        >
                            <div className="flex flex-col">
                                {Object.entries(schedulesByPic).map(([pic, schedules], index) => (
                                    <div 
                                        key={pic} 
                                        className={`
                                            flex items-center px-4 border-b border-gray-100
                                            ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                            hover:bg-blue-50 transition-colors duration-200
                                        `}
                                        style={{ height: rowHeight }}
                                    >
                                        <div className="flex items-center space-x-3 w-full">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-sm font-medium">
                                                    {pic ? pic.charAt(0).toUpperCase() : 'U'}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {pic || 'Unassigned'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {schedules.length} schedule{schedules.length > 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="flex-1 relative">
                            {Object.entries(schedulesByPic).map(([pic, schedules], index) => (
                                <div 
                                    key={pic} 
                                    className={`
                                        relative border-b border-gray-100
                                        ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                        hover:bg-blue-50 transition-colors duration-200
                                    `}
                                    style={{ height: rowHeight }}
                                >
                                    {schedules.map((schedule) => {
                                        const { left, width } = calculateSchedulePosition(schedule);
                                        
                                        return (
                                            <div
                                                key={schedule.id}
                                                className="absolute group"
                                                style={{
                                                    left: `${left + 4}px`,
                                                    width: `${Math.max(width - 8, 80)}px`,
                                                    top: '8px',
                                                    height: `${rowHeight - 16}px`
                                                }}
                                            >
                                                <div className="
                                                    h-full w-full rounded-lg border border-blue-200 bg-blue-50 
                                                    hover:bg-blue-100 hover:border-blue-300 hover:shadow-md
                                                    transition-all duration-200 cursor-pointer
                                                    flex items-center justify-between px-3
                                                ">
                                                    <div className="text-xs font-medium text-blue-900 truncate flex-1">
                                                        {schedule.scheduleName}
                                                    </div>
                                                    
                                                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                                                        <Link href={`/schedule/${schedule.id}/edit`}>
                                                            <div className="p-1.5 rounded-md bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm">
                                                                <Image src="/images/icon/edit-2.svg" alt="edit" height={12} width={12} />
                                                            </div>
                                                        </Link>
                                                        <div 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(schedule.id);
                                                            }}
                                                            className="p-1.5 rounded-md bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                                                        >
                                                            <Image src="/images/icon/trash.svg" alt="delete" height={12} width={12} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Current Week Indicator Line */}
                    {lineLeft !== null && (
                        <div
                            className="absolute bg-red-500 z-10 shadow-sm"
                            style={{ 
                                left: `${lineLeft + picColumnWidth}px`,
                                top: `${headerHeight}px`,
                                bottom: 0,
                                width: '2px'
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}