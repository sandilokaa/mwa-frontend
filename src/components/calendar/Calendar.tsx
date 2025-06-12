"use client"

import { eachWeekOfInterval, startOfMonth, endOfMonth } from "date-fns";

export default function DashoardCalendar() {

    const generateWeeks = (year: number, month: number) => {
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));
        return eachWeekOfInterval({ start, end }).map((_, i) => `w${i + 1}`);
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April",
        "Mei", "Juni", "Juli", "Agustus",
        "September", "Oktober", "November", "Desember"
    ];

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear + 1];

    return (
        <div className=" grid grid-cols-1 overflow-x-auto p-4 bg-white rounded">
            <div className="flex flex-col gap-2 min-w-max">
                <div className="flex gap-2">
                    {years.map((year) => (
                        <div
                            key={year}
                            className="flex justify-center font-bold text-lg"
                            style={{ width: `${12 * 140}px` }}
                        >
                            {year}
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    {years.map((year) =>
                        monthNames.map((month, monthIndex) => (
                            <div
                                key={`${year}-${month}`}
                                className="min-w-[140px] border p-2 rounded bg-gray-50"
                            >
                                <div className="text-sm font-semibold mb-1 text-center">{month}</div>
                                    <div className="flex gap-1 flex-wrap">
                                    {generateWeeks(year, monthIndex).map((week) => (
                                        <div
                                            key={week}
                                            className="bg-blue-100 text-xs px-2 py-1 rounded"
                                        >
                                            {week}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
