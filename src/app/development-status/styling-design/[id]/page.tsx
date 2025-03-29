"use client"

import Link from "next/link";
import Image from "next/image";

export default function DetailData() {
    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/styling-design">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Styling Design Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Styling Design Information</p>
                        <Link className="cursor-pointer" href="/development-status/styling-design/:id/edit">
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}