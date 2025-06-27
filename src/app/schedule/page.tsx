"use client"

import Link from "next/link";

import DashoardCalendar from "@/components/calendar/Calendar";
import AddButton from "@/components/common/button/AddButton";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-5">
                <p className="font-bold">Master Schedule</p>
                <div className="flex justify-between">
                    <Link href="/dashboard/add">
                        <AddButton
                            buttonText="Add Event"
                        />
                    </Link>
                </div>
            </div>
            <div className="mt-5">
                <DashoardCalendar/>
            </div>
        </div>
    );
}
