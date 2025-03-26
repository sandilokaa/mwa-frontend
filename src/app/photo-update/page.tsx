"use client"

import Link from "next/link";
import Image from "next/image";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import DropdownCategory from "@/components/common/dropdown/DropdownFilterCategory";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Photo Update</p>
                <div className="flex justify-between">
                    <Link href="/photo-update/add">
                        <AddButton
                            buttonText="Add Photo"
                        />
                    </Link>
                    <div className="flex gap-5">
                        <DropdownCategory
                            options={["Chassis", "Drivetrain", "Wheel", "Suspension"]}
                            onSelect={() => ""}
                        />
                        <SearchInput
                            value=""
                            onChange={() => ""}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <div className="grid grid-cols-1">
                    <p className="font-bold">Chassis</p>
                </div>
                <div className="mt-5">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="relative group cursor-pointer">
                            <Image className="w-full h-auto" src="/images/general/chassis-try.png" alt="Item Image" width={275} height={330}/>
                            <div className="absolute left-0 inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 flex flex-col justify-end text-white p-4 transition-opacity duration-300 rounded-[8px]">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">12/05/2025</p>
                                        <p className="text-sm font-medium mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
                                    </div>
                                    <div className="flex gap-[10px] justify-end">
                                        <Link href="#">
                                            <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                            </div>
                                        </Link>
                                        <Link href="#">
                                            <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                            </div>
                                        </Link>
                                        <div className="p-2 rounded-sm bg-[#D62C35] cursor-pointer">
                                            <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}