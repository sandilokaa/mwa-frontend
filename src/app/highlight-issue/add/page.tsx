"use client"

import Image from "next/image";
import Link from "next/link";
import InputForm from "@/components/common/input/InputForm";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import SubmitButton from "@/components/common/button/SubmitButton";
import Dropdown from "@/components/common/dropdown/DropdownForm";

export default function AddData() {

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/highlight-issue">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Highligth Issue</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Highligth Issue Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <InputForm
                                    label="Item Name *"
                                    placeholder="Example: Chassis Assy"
                                />
                            </div>
                            <Dropdown
                                label="Category *"
                                options={["Chassis"]}
                                onSelect={() => ""}
                            />
                            <Dropdown
                                label="PIC (C/M) *"
                                options={["Mechanical Engineering", "Electrical Engineering", "Industrial Design", "Production Issue", "Procurement Issue"]}
                                onSelect={() => ""}
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Issue *"
                                placeholder="Example: Describe the issue"
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Countermeassure (C/M) *"
                                placeholder="Example: Describe the countermeassure"
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Dropdown
                                label="Product *"
                                options={["6x6 Conversion"]}
                                onSelect={() => ""}
                            />
                            <DateInputForm
                                label="Date *"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            buttonText="Add Highlight Issue"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}