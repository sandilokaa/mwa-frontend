"use client"

import Image from "next/image";
import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Procurement</p>
                <div className="flex justify-between">
                    <Link href="/development-status/procurement/add">
                        <AddButton
                            buttonText="Add Procurement"
                            height="45px"
                            width="200px"
                        />
                    </Link>
                    <SearchInput
                        value=""
                        onChange={() => ""}
                    />
                </div>
            </div>
            <div className="mt-5">
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Procurement Chart</h2>
                    </div>
                    <div className="grid grid-rows-[auto_auto] gap-5">
                        <div className="bg-white p-5 rounded-[10px] flex flex-col">
                            <h3 className="text-sm font-bold">Total Procurement</h3>
                            <p className="mt-5 text-4xl font-bold text-center">126</p>
                        </div>
                        <div className="bg-white p-5 rounded-[10px]">
                            <h3 className="font-bold text-sm">Timeline Notification</h3>
                            <div className="space-y-2 mt-5">
                                {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-[10px] p-2 bg-white rounded-[10px] border border-[#F5F5F5]">
                                    <div className="flex justify-center bg-[#FEF2F3] h-[45px] w-[45px] rounded-[10px]">
                                        <Image src="/images/icon/calendar-1.svg" alt="Date Icon" width={18} height={20}/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Chassis Assy</p>
                                        <p className="text-sm text-gray-500">Due Date: 12/02/2024</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="overflow-x-auto rounded-lg bg-white p-[10px]">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-[#F5F5F5]">
                            <tr className="text-sm font-bold text-center">
                                <th className="py-5 px-4 text-left">No</th>
                                <th className="py-5 px-4 text-left min-w-[200px]">Item</th>
                                <th className="py-5 px-4 min-w-[170px]">PR Number</th>
                                <th className="py-5 px-4 min-w-[170px]">PO Number</th>
                                <th className="py-5 px-4 min-w-[170px]">Vendor</th>
                                <th className="py-5 px-4 min-w-[170px]">Status</th>
                                <th className="py-5 px-4 min-w-[170px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-sm font-medium text-center">
                                <td className="py-5 px-4 text-left">01</td>
                                <td className="py-5 px-4 text-left">Chassis Assy</td>
                                <td className="py-5 px-4">123456789</td>
                                <td className="py-5 px-4 ">123456789</td>
                                <td className="py-5 px-4">Tokopedia</td>
                                <td className="py-5 px-4">
                                    <div className="flex justify-center">
                                        <p className="p-2 text-[#00CBCB] bg-[#DBF2F2] rounded-[5px]">PR Approved</p>
                                    </div>
                                </td>
                                <td className="py-5 px-4">
                                    <div className="flex gap-[10px] justify-center">
                                        <Link href="/development-status/procurement/:id">
                                            <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                            </div>
                                        </Link>
                                        <Link href="/development-status/procurement/:id/edit">
                                            <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                            </div>
                                        </Link>
                                        <div className="p-2 rounded-sm bg-[#D62C35] cursor-pointer">
                                            <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}