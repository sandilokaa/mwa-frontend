"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";

import InputForm from "@/components/common/input/InputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DateInputForm from "@/components/common/input/DateInputFrom";

export default function AddData() {

    const { products } = useAppSelector((state) => state.productList);

    const [pic, setPIC] = useState("");

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/schedule">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Schedule</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Schedule Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Schedule Name *"
                                placeholder="Example: Chassis Assy"
                            />
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={() => {}}
                            />
                            <DropdownString
                                label="PIC (C/M) *"
                                options={["RnE", "Styling Design", "Vehicle Engineering", "CAE Engineer", "Procurement", "PMO", "Production"]}
                                onSelect={(value) => setPIC(value)}
                                value={pic}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DateInputForm
                                label="Start Date *"
                            />
                            <DateInputForm
                                label="End Date *"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={() => {}}
                            buttonText="Add Schedule"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}