"use client"

import { useRef, useEffect, useState } from "react";
import { eachWeekOfInterval, startOfMonth, endOfMonth } from "date-fns";

export default function DashoardCalendar() {

    const currentWeekRef = useRef<HTMLDivElement | null>(null);
    const [lineLeft, setLineLeft] = useState<number | null>(null);

    const generateWeeks = (year: number, month: number) => {
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));
        const weeks = eachWeekOfInterval({ start, end });

        const result: string[] = [];

        for (let i = 0; i < weeks.length; i++) {
            if (i < 3) {
                result.push(`W${i + 1}`);
            } else if (i === 3) {
                result.push(`W4`);
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
            const weekStart = weeks[i];
            const weekEnd = weeks[i + 1] ?? end;

            if (today >= weekStart && today < weekEnd) {
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
        if (currentWeekRef.current) {
            currentWeekRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
            const rect = currentWeekRef.current.getBoundingClientRect();
            const parentRect = currentWeekRef.current.offsetParent?.getBoundingClientRect();
            if (rect && parentRect) {
                setLineLeft(rect.left - parentRect.left + rect.width / 2);
            }
        }
    }, []);

    return (
        <div className="flex gap-2">
            <div className="relative grid grid-cols-1 overflow-x-auto p-5 bg-white rounded">
                <div className="flex flex-col gap-2 min-w-max">
                    <div className="flex gap-2 border border-gray-200 rounded-sm p-2">
                        {years.map((year) =>
                            monthNames.map((month, monthIndex) => { 
                                const currentWeekLabel = getCurrentWeekLabel(year, monthIndex);
                                
                                return (
                                    <div
                                        key={`${year}-${month}`}
                                        className="min-w-[140px] p-2 rounded bg-gray-50"
                                    >
                                        
                                        <div className="text-sm font-semibold text-center">{year}</div>
                                        <div className="text-sm font-semibold mb-1 text-center">{month}</div>
                                            <div className="flex gap-2 flex-wrap">
                                                {generateWeeks(year, monthIndex).map((week) => {
                                                    const isCurrent =
                                                        year === new Date().getFullYear() &&
                                                        monthIndex === new Date().getMonth() &&
                                                        week === currentWeekLabel;

                                                    return (
                                                        <div
                                                            ref={isCurrent ? currentWeekRef : null}
                                                            key={week}
                                                            className={`text-xs font-medium px-3 py-2 rounded ${isCurrent ? "bg-red-500 text-white font-bold" : "bg-blue-100"}`}
                                                        >
                                                            {week}
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
                        className="absolute top-[110px] bottom-0 w-[2px] bg-red-500 z-0"
                        style={{ left: `${lineLeft}px` }}
                    />
                )}
            </div>
        </div>
    );
}
