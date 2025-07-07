"use client"

import { useRef, useEffect, useState } from "react";
import { eachWeekOfInterval, startOfMonth, endOfMonth, isWithinInterval, addDays, startOfWeek, endOfWeek, differenceInDays } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredSchedule } from "@/store/slice/schedule/getAllSlice";
import { Schedule } from "@/store/slice/schedule/getAllSlice";

export default function DashoardCalendar() {
    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();

    /* ------------------- Set Week ------------------- */
    const currentWeekRef = useRef<HTMLDivElement | null>(null);
    const [lineLeft, setLineLeft] = useState<number | null>(null);
    const [weekElements, setWeekElements] = useState<{[key: string]: DOMRect}>({});

    const generateWeeks = (year: number, month: number) => {
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));
        const weeks = eachWeekOfInterval({ start, end });

        const result: {label: string, start: Date, end: Date}[] = [];

        for (let i = 0; i < weeks.length; i++) {
            const weekStart = startOfWeek(weeks[i]);
            const weekEnd = endOfWeek(weeks[i]);
            
            if (i < 3) {
                result.push({label: `W${i + 1}`, start: weekStart, end: weekEnd});
            } else if (i === 3) {
                result.push({label: `W4`, start: weekStart, end: weekEnd});
            }
        }

        return result;
    };

    const getCurrentWeekLabel = (year: number, month: number) => {
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));
        const weeks = eachWeekOfInterval({ start, end });
        const today = new Date();

        for (let i = 0; i < weeks.length; i++) {
            const weekStart = startOfWeek(weeks[i]);
            const weekEnd = endOfWeek(weeks[i]);

            if (today >= weekStart && today <= weekEnd) {
                if (i < 3) return `W${i + 1}`;
                return `W4`;
            }
        }

        return null;
    };

    const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const years = Array.from({length:11}, (_, i) => 2024 + i);

    useEffect(() => {
        const el = currentWeekRef.current;
        if (el && el.offsetParent) {
            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            const left = el.offsetLeft + el.offsetWidth / 2.25;
            setLineLeft(left);
        }
    }, []);

    /* ------------------- End Set Week ------------------- */

    /* ------------------- Get Schedule ------------------- */
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

    /* ------------------- End Get Schedule ------------------- */

    return (
        <div className="flex gap-2">
            <div className="relative grid grid-cols-1 overflow-x-auto p-5 bg-white rounded">
                {/* Header Timeline */}
                <div className="flex flex-col gap-2 min-w-max">
                    <div className="flex gap-2 border border-gray-200 rounded-sm p-2">
                        {years.map((year) =>
                            monthNames.map((month, monthIndex) => { 
                                const currentWeekLabel = getCurrentWeekLabel(year, monthIndex);
                                const weeks = generateWeeks(year, monthIndex);
                                
                                return (
                                    <div
                                        key={`${year}-${month}`}
                                        className="min-w-[140px] p-2 rounded bg-gray-50"
                                    >
                                        <div className="text-sm font-semibold text-center">{year}</div>
                                        <div className="text-sm font-semibold mb-1 text-center">{month}</div>
                                        <div className="flex gap-2 flex-wrap">
                                            {weeks.map((week) => {
                                                const isCurrent =
                                                    year === new Date().getFullYear() &&
                                                    monthIndex === new Date().getMonth() &&
                                                    week.label === currentWeekLabel;

                                                return (
                                                    <div
                                                        ref={isCurrent ? currentWeekRef : null}
                                                        key={week.label}
                                                        className={`text-xs font-medium px-3 py-2 rounded ${isCurrent ? "bg-red-500 text-white font-bold" : "bg-blue-100"}`}
                                                    >
                                                        {week.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
                {lineLeft !== null && (
                    <div
                        className="absolute top-[110px] bottom-0 w-[6px] bg-red-500 z-0"
                        style={{ left: `${lineLeft}px` }}
                    />
                )}
            </div>
        </div>
    );
}