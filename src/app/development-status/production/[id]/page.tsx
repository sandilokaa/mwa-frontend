"use client"

import Link from "next/link";
import Image from "next/image";

import DocumentBadge from "@/components/common/badge/DocumentBadge";

export default function DetailData() {
    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/production/:id/edit">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Designed Production Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Designed Production Information</p>
                        <Link className="cursor-pointer" href="/development-status/production/:id/edit">
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4 mt-5 font-medium">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Part Name</p>
                                <p>Example: XXXXXXX</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">PIC Production</p>
                                <p>Example: XXXXXXX</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Part Number</p>
                                <p>Example: XXXXXXX</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Drawing Number</p>
                                <p>Example: XXXXXXX</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Information</p>
                                <p>Example: XXXXXXX</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Supporting Documents</p>
                                <DocumentBadge
                                    text="blablabla"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full rounded-[10px] p-5 self-start">
                    <p className="text-sm font-bold">Designed Production Status</p>
                    <div className="mt-4">
                        <p
                            className={`
                                text-sm font-medium inline-block py-[10px] px-4 rounded-[5px]
                            `}
                        >
                            On Progress
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}