"use client"

import Image from "next/image";
import Link from "next/link";
import SubmitButton from "@/components/common/button/SubmitButton";
import InputForm from "@/components/common/input/InputForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import Dropdown from "@/components/common/dropdown/DropdownForm";

export default function AddData() {
    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/procurement">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Procurement</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Procurement Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Item name *"  
                                placeholder="Example: Hilux Single Cabin 4x4"
                            />
                            <DateInputForm
                                label="Submission Date *"
                            />
                            <DateInputForm
                                label="ETA Target *"
                            />
                        </div>  
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="PR Number *"
                                placeholder="Example: PR-BDG-03003"
                            />
                            <InputForm
                                label="PO Number *"
                                placeholder="Example: PO-BDG-01715"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Dropdown
                                label="Product *"
                                options={[]}
                                onSelect={() => ""}
                            />
                            <InputForm
                                label="Quantity *"
                                placeholder="Example: 1"
                            />
                            <InputForm
                                label="Vendor *"
                                placeholder="Example: Josh Hollong"
                            />
                        </div> 
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            buttonText="Add Procurement"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}