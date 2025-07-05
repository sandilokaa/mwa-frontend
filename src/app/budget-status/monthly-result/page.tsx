"use client"

import Link from "next/link";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";

export default function ShowData() {

    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Budget Status Monthly</p>
                <div className="flex justify-between">
                    <Link href="/budget-status/monthly-result/add">
                        <AddButton
                            buttonText="Add Budget Status Monthly"
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
                    <div className="flex flex-col justify-between w-3/4 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Budget Status Monthly Chart</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-1/4 h-full">
                        <div className="bg-white p-5 rounded-[10px] flex flex-col">
                            <h3 className="text-sm font-bold">History</h3>
                            <p className="mt-5 text-4xl font-bold text-center"></p>
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
                                <th className="py-5 px-4 text-left min-w-[180px]">Budget Code</th>
                                <th className="py-5 px-4 min-w-[180px]">Product Name</th>
                                <th className="py-5 px-4 min-w-[150px]">Purchase Request</th>
                                <th className="py-5 px-4 min-w-[120px]">Quantity</th>
                                <th className="py-5 px-4 min-w-[130px]">Price</th>
                                <th className="py-5 px-4 min-w-[150px]">Grand Total</th>
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