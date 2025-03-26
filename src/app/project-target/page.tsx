"use client"

import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Project Target</p>
                <div className="flex justify-between">
                    <Link href="/project-target/add">
                        <AddButton
                            buttonText="Add Project Target"
                            height="45px"
                            width="200px"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}