"use client"

import Image from "next/image"
import DropdownProduct from "../common/dropdown/DropdownProduct"

export default function Navbar() {
    return (
        <div className="p-5 h-auto bg-white">
            <div className="flex justify-end gap-3">
                <div className="flex">
                    <DropdownProduct
                        options={["6x6 Conversion"]}
                    />
                </div>
                <div className="flex gap-x-[8px] justify-center items-center py-2 px-4 bg-[#292929] text-white rounded-sm">
                    <Image src="/images/icon/profile.svg" alt="Profile Icon" width={20} height={20}/>
                    <p className="text-sm">Sandi Loka A</p>
                </div>
                <div className="flex gap-x-[8px] justify-center items-center py-2 px-4 bg-[#FEF2F3] text-white rounded-sm cursor-pointer">
                    <Image className="h-[20px] w-[20px]" src="/images/icon/logout.svg" alt="Logout Icon" width={20} height={20}/>
                    <p className="text-sm text-[#EB575F]">Logout</p>
                </div>
            </div>
        </div>
    )
}