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
        const monthStart = startOfMonth(new Date(year, month));
        const monthEnd = endOfMonth(new Date(year, month));
        const weeksInMonth = eachWeekOfInterval({ start: monthStart, end: monthEnd });

        const result: {label: string, start: Date, end: Date}[] = [];

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
        if (currentWeekRef.current && monthYearData.length > 0) {
            const el = currentWeekRef.current;
            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            
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
                // Hitung posisi tengah dari week cell
                const centerPosition = (weekIndex * timelineCellWidth) + (timelineCellWidth / 2);
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
    const baseRowHeight = 60;
    const scheduleItemHeight = 45;
    const scheduleSpacing = 4;

    const calculateSchedulePosition = (schedule: Schedule) => {
        const startDate = new Date(schedule.startDate);
        const endDate = new Date(schedule.endDate);
        
        let startWeek: {start: Date, end: Date} | null = null;
        let endWeek: {start: Date, end: Date} | null = null;
        let startIndex = -1;
        let endIndex = -1;
        
        for (let i = 0; i < monthYearData.length; i++) {
            const yearData = monthYearData[i];
            for (let j = 0; j < yearData.weeks.length; j++) {
                const week = yearData.weeks[j];
                
                if (!startWeek && startDate >= week.start && startDate <= week.end) {
                    startWeek = week;
                    startIndex = i * 4 + j;
                }
                
                if (!endWeek && endDate >= week.start && endDate <= week.end) {
                    endWeek = week;
                    endIndex = i * 4 + j;
                }
                
                if (startWeek && endWeek) break;
            }
            if (startWeek && endWeek) break;
        }
        
        if (!endWeek && startWeek) {
            const endMonth = endDate.getMonth();
            const endYear = endDate.getFullYear();
            
            const monthData = monthYearData.find(d => d.year === endYear && d.month === endMonth);
            if (monthData) {
                for (let j = monthData.weeks.length - 1; j >= 0; j--) {
                    const week = monthData.weeks[j];
                    if (endDate >= week.start && endDate <= week.end) {
                        endWeek = week;
                        const monthIndex = monthYearData.findIndex(d => d.year === endYear && d.month === endMonth);
                        endIndex = monthIndex * 4 + j;
                        break;
                    }
                }
            }
        }
        
        if (!startWeek || !endWeek || startIndex === -1 || endIndex === -1) {
            console.warn('Could not find week range for schedule:', {
                scheduleName: schedule.scheduleName,
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                foundStart: !!startWeek,
                foundEnd: !!endWeek
            });
            return { left: 0, width: 0, startIndex, endIndex };
        }
        
        const left = startIndex * timelineCellWidth;
        const width = (endIndex - startIndex + 1) * timelineCellWidth;
        
        return { left, width, startIndex, endIndex };
    };

    const assignScheduleLayers = (schedules: Schedule[]) => {
        const schedulesWithPosition = schedules.map(schedule => ({
            ...schedule,
            position: calculateSchedulePosition(schedule)
        }));

        schedulesWithPosition.sort((a, b) => {
            if (a.position.startIndex !== b.position.startIndex) {
                return a.position.startIndex - b.position.startIndex;
            }
            return b.position.width - a.position.width;
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const layers: Array<{schedule: Schedule, position: any, layer: number}[]> = [];
        
        schedulesWithPosition.forEach(item => {
            let assignedLayer = 0;
            
            while (assignedLayer < layers.length) {
                const hasOverlap = layers[assignedLayer].some(existingItem => {
                    const existingEnd = existingItem.position.startIndex + (existingItem.position.width / timelineCellWidth) - 1;
                    const currentEnd = item.position.startIndex + (item.position.width / timelineCellWidth) - 1;
                    
                    return !(currentEnd < existingItem.position.startIndex || item.position.startIndex > existingEnd);
                });
                
                if (!hasOverlap) {
                    break;
                }
                assignedLayer++;
            }
            
            if (assignedLayer >= layers.length) {
                layers.push([]);
            }
            
            layers[assignedLayer].push({
                schedule: item,
                position: item.position,
                layer: assignedLayer
            });
        });

        return layers.flat();
    };

    const schedulesByPic = useMemo(() => {
        if (!filteredSchedule) return {};
        
        const groupedByPic = filteredSchedule.reduce((acc, schedule) => {
            const { pic } = schedule;
            if (!acc[pic]) {
                acc[pic] = [];
            }
            acc[pic].push(schedule);
            return acc;
        }, {} as Record<string, Schedule[]>);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: Record<string, Array<{schedule: Schedule, position: any, layer: number}>> = {};
        Object.entries(groupedByPic).forEach(([pic, schedules]) => {
            result[pic] = assignScheduleLayers(schedules);
        });

        return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredSchedule, monthYearData]);

    const picRowHeights = useMemo(() => {
        const heights: Record<string, number> = {};
        Object.entries(schedulesByPic).forEach(([pic, schedulesWithLayers]) => {
            const maxLayer = Math.max(...schedulesWithLayers.map(item => item.layer), 0);
            const layerCount = maxLayer + 1;
            heights[pic] = Math.max(baseRowHeight, (layerCount * scheduleItemHeight) + ((layerCount + 1) * scheduleSpacing));
        });
        return heights;
    }, [schedulesByPic]);

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
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative">
                    <div 
                        className="absolute left-0 top-0 z-40 bg-white border-r border-gray-200"
                        style={{ width: picColumnWidth }}
                    >
                        <div 
                            className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"
                            style={{ height: headerHeight }}
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
                        
                        <div className="flex flex-col">
                            {Object.entries(schedulesByPic).map(([pic, schedulesWithLayers], index) => {
                                const rowHeight = picRowHeights[pic] || baseRowHeight;
                                return (
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
                                                    {schedulesWithLayers.length} schedule{schedulesWithLayers.length > 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div 
                        className="overflow-x-auto"
                        style={{ marginLeft: picColumnWidth }}
                    >
                        <div className="min-w-max timeline-content">
                            <div 
                                className="bg-white border-b border-gray-200"
                                style={{ height: headerHeight }}
                            >
                                <div className="flex flex-col h-full">
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
                                    
                                    <div className="flex h-12">
                                        {monthYearData.map(({ year, month, weeks }) => {
                                            return (
                                                <div key={`${year}-${month}-weeks`} className="flex">
                                                    {weeks.map((week) => {
                                                        const today = new Date();
                                                        const isCurrent = today >= week.start && today <= week.end;

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

                            <div className="relative">
                                {Object.entries(schedulesByPic).map(([pic, schedulesWithLayers], index) => {
                                    const rowHeight = picRowHeights[pic] || baseRowHeight;
                                    return (
                                        <div 
                                            key={pic} 
                                            className={`
                                                relative border-b border-gray-100
                                                ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                                hover:bg-blue-50 transition-colors duration-200
                                            `}
                                            style={{ height: rowHeight }}
                                        >
                                            {schedulesWithLayers.map((item) => {
                                                const { schedule, position, layer } = item;
                                                const { left, width } = position;
                                                
                                                return (
                                                    <div
                                                        key={schedule.id}
                                                        className="absolute group"
                                                        style={{
                                                            left: `${left + 4}px`,
                                                            width: `${Math.max(width - 8, 80)}px`,
                                                            top: `${scheduleSpacing + (layer * (scheduleItemHeight + scheduleSpacing))}px`,
                                                            height: `${scheduleItemHeight}px`
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
                                    );
                                })}
                                
                                {lineLeft !== null && (
                                    <div
                                        className="absolute bg-red-500 z-10 shadow-sm"
                                        style={{ 
                                            left: `${lineLeft}px`,
                                            top: 0,
                                            bottom: 0,
                                            width: '2px'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}