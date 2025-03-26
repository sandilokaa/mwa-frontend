"use client"

import Link from "next/link";
import Image from "next/image";

export default function DetailData() {
    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/highlight-issue">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Highlight Issue Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Highligth Issue Information</p>
                        <Link className="cursor-pointer" href="/highlight-issue/:id/edit">
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4 mt-5 font-medium">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Item Name</p>
                                <p>Chassis Assy</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Category</p>
                                <p>Chassis</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">PIC (C/M)</p>
                                <p>Mechanical Engineering</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Issue</p>
                                <p>We change the plan from extending Hilux Chassis to make the whole chassis from scratch. Thus delay 3W from the initial plan of 3D release.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Countermeassure (C/M)</p>
                                <p>We change the plan from extending Hilux Chassis to make the whole chassis from scratch. Thus delay 3W from the initial plan of 3D release.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Due Date</p>
                                <p>12/04/2024</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full rounded-[10px] p-5 self-start">
                    <p className="text-sm font-bold">Highligth Issue Status</p>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-[#EB575F] bg-[#FEF2F3] inline-block py-[10px] px-4 rounded-[5px]">On Progress</p>
                    </div>
                </div>
            </div>
        </div>
    );
}