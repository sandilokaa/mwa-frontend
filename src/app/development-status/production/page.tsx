"use client"

import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Development Status Production</p>
                <div className="flex justify-between">
                    <Link href="/development-status/production/add">
                        <AddButton
                            buttonText="Add Production"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}