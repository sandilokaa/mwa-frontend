"use client"

import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Development Status Styling Design</p>
                <div className="flex justify-between">
                    <Link href="/development-status/styling-design/add">
                        <AddButton
                            buttonText="Add Styling Design"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}