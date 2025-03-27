"use client"

import Image from "next/image";
import Link from "next/link";

export default function AddData() {

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/styling-design">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Styling Design</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Styling Design Form</p>
            </div>
        </div>
    );
}