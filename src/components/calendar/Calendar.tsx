"use client"

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { deleteSchedule, resetDeleteState } from "@/store/slice/schedule/deleteSlice";
import { refetchSchedule } from "@/utils/refetch/refetchSchedule";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useScheduleCalendar } from "@/hooks/useScheduleCalendar";
import { TIMELINE_CONFIG } from "@/utils/schedule/calendar";

import ConfirmDialog from "../common/modal/ConfirmDialog";
import ScheduleTooltip from "../common/modal/ScheduleTooltip";

export default function DashboardCalendar() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { selectedProduct } = useProductFilter();

    /* --------------- Get Schedule --------------- */

    const {
        currentWeekRef,
        years,
        monthNames,
        monthYearData,
        lineLeft,
        schedulesByPic,
        picRowHeights,
    } = useScheduleCalendar();

    /* --------------- End Get Schedule --------------- */
    
    
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

    /* --------------- Tooltip State --------------- */
    
    const [tooltip, setTooltip] = useState<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schedule: any;
        position: { x: number; y: number };
        isVisible: boolean;
    }>({
        schedule: null,
        position: { x: 0, y: 0 },
        isVisible: false
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleScheduleMouseEnter = (schedule: any, event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({
            schedule,
            position: {
                x: rect.left + rect.width / 2,
                y: rect.top
            },
            isVisible: true
        });
    };

    const handleScheduleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, isVisible: false }));
    };

    /* --------------- End Tooltip State --------------- */

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

            <ScheduleTooltip
                schedule={tooltip.schedule}
                position={tooltip.position}
                isVisible={tooltip.isVisible}
            />
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative">
                    <div 
                        className="absolute left-0 top-0 z-40 bg-white border-r border-gray-200"
                        style={{ width: TIMELINE_CONFIG.picColumnWidth }}
                    >
                        <div 
                            className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200"
                            style={{ height: TIMELINE_CONFIG.headerHeight }}
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
                                const rowHeight = picRowHeights[pic] || TIMELINE_CONFIG.baseRowHeight;
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
                        style={{ marginLeft: TIMELINE_CONFIG.picColumnWidth }}
                    >
                        <div className="min-w-max timeline-content">
                            <div 
                                className="bg-white border-b border-gray-200"
                                style={{ height: TIMELINE_CONFIG.headerHeight }}
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
                                                            style={{width: weeksInMonth * TIMELINE_CONFIG.cellWidth}}
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
                                                                style={{width: TIMELINE_CONFIG.cellWidth}}
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
                                    const rowHeight = picRowHeights[pic] || TIMELINE_CONFIG.baseRowHeight;
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
                                                            top: `${TIMELINE_CONFIG.scheduleSpacing + (layer * (TIMELINE_CONFIG.scheduleItemHeight + TIMELINE_CONFIG.scheduleSpacing))}px`,
                                                            height: `${TIMELINE_CONFIG.scheduleItemHeight}px`
                                                        }}
                                                        onMouseEnter={(e) => handleScheduleMouseEnter(schedule, e)}
                                                        onMouseLeave={handleScheduleMouseLeave}
                                                    >
                                                        <div className="
                                                            h-full w-full rounded-lg border border-blue-200 bg-blue-50 
                                                            hover:bg-blue-100 hover:border-blue-300 hover:shadow-md
                                                            transition-all duration-200 cursor-pointer
                                                            flex items-center px-3
                                                        ">
                                                            <div className="text-xs font-medium text-blue-900 truncate text-center w-full">
                                                                {schedule.scheduleName}
                                                            </div>
                                                            
                                                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 right-0 mr-2">
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