"use client"

import Image from "next/image";
import Link from "next/link";

export default function EditData() {
    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/project-target">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Project Target</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Project Target Form</p>
            </div>
        </div>
    );
}