"use client"

import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";

export default function ShowData() {
    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Designed Engineering</p>
                <div className="flex justify-between">
                    <Link href="/development-status/engineering/add">
                        <AddButton
                            buttonText="Add Designed Engineering"
                        />
                    </Link>
                    <SearchInput
                        value={""}
                        onChange={() => "setSearch(e.target.value)"}
                    />
                </div>
            </div>
            <div className="mt-5">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col justify-between w-3/4 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Cumulative Designed Engineering Performance</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-full bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Designed Engineering Status Overview</h2>
                    </div>
                </div>
            </div>
            <div className="mt-5">
            <div className="overflow-x-auto rounded-lg bg-white p-[10px]">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-[#F5F5F5]">
                            <tr className="text-sm font-bold text-center">
                                <th className="py-5 px-4 text-left">No</th>
                                <th className="py-5 px-4 text-left min-w-[200px]">Part Name</th>
                                <th className="py-5 px-4 min-w-[170px]">Drawing Number</th>
                                <th className="py-5 px-4 min-w-[170px]">Part Number</th>
                                <th className="py-5 px-4 min-w-[170px]">Remarks</th>
                                <th className="py-5 px-4 min-w-[150px]">Status</th>
                                <th className="py-5 px-4 min-w-[150px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}