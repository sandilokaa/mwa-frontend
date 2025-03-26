"use client"

import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Development Status Engineering</p>
                <div className="flex justify-between">
                    <Link href="/development-status/engineering/add">
                        <AddButton
                            buttonText="Add Engineering"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}