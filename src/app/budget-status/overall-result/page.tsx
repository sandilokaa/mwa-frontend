"use client"

import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";

export default function ShowData() {

    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Budget Status Overall Result</p>
                <div className="flex justify-between">
                    <Link href="/budget-status/overall-result/add">
                        <AddButton
                            buttonText="Add Budget Status"
                        />
                    </Link>
                    <SearchInput
                        value={""}
                        onChange={() => {}}
                    />
                </div>
            </div>
            <div className="mt-5">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col justify-between w-1/2 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Budget Status Overall Result Chart</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                    <div className="flex flex-col justify-between w-1/2 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Budget Status Overall Result Chart</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="rounded-lg bg-white p-[10px]">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-[#F5F5F5]">
                            <tr className="text-sm font-bold text-center">
                                <th className="py-5 px-4 text-left">No</th>
                                <th className="py-5 px-4 text-left min-w-[170px]">Product</th>
                                <th className="py-5 px-4 min-w-[170px]">Budget Month</th>
                                <th className="py-5 px-4 min-w-[150px]">Realization</th>
                                <th className="py-5 px-4 min-w-[150px]">Nominal</th>
                                <th className="py-5 px-4 min-w-[120px]">Percentage</th>
                                <th className="py-5 px-4 min-w-[150px]">Total</th>
                                <th className="py-5 px-4 min-w-[140px]">Action</th>
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