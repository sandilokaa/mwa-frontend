"use client"

import Link from "next/link";

import DashboardCalendar from "@/components/calendar/Calendar";
import AddButton from "@/components/common/button/AddButton";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-5">
                <p className="font-bold">Master Schedule</p>
                <div className="flex justify-between">
                    <Link href="/schedule/add">
                        <AddButton
                            buttonText="Add Schedule"
                        />
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <DashboardCalendar/>
            </div>
        </div>
    );
}
