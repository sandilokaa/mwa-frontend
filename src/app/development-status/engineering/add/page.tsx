"use client"

import Image from "next/image";
import Link from "next/link";

import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DateInputForm from "@/components/common/input/DateInputFrom";

export default function AddData() {

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/engineering">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Designed Engineering</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Designed Engineering Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Part Name *"
                                placeholder="Example: Chassis Assy"
                            />
                            <InputForm
                                label="Part Number *"
                                placeholder="Example: Chassis Assy"
                            />
                            <InputForm
                                label="Drawing Number *"
                                placeholder="Example: Chassis Assy"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownString
                                label="Status 3D *"
                                options={["Mechanical Engineering"]}
                                onSelect={() => ""}
                            />
                            <DropdownString
                                label="Status 2D *"
                                options={["Mechanical Engineering"]}
                                onSelect={() => ""}
                            />
                            <DropdownString
                                label="Status DXF *"
                                options={["Mechanical Engineering"]}
                                onSelect={() => ""}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownProductForm
                                label="Product *"
                                options={[]}
                                onSelect={() => ""}
                            />
                            <DropdownString
                                label="PIC 3D *"
                                options={["Mechanical Engineering"]}
                                onSelect={() => ""}
                            />
                            <DropdownString
                                label="PIC 2D & DXF *"
                                options={["Mechanical Engineering"]}
                                onSelect={() => ""}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Price *"
                                placeholder="Example: Chassis Assy"
                            />
                            <InputForm
                                label="Quantity *"
                                placeholder="Example: Chassis Assy"
                            />
                            <InputForm
                                label="Total Price *"
                                placeholder="Example: Chassis Assy"
                                disable
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DateInputForm
                                label="Submission Date *"
                            />
                            <DateInputForm
                                label="Required Date *"
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Remarks *"
                                placeholder="Example: Describe the remark"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Documents *"
                                acceptFile=".pdf"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={() => ""}
                            buttonText="Add Production"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}