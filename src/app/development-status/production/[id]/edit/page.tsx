"use client"

import Image from "next/image";
import Link from "next/link";
import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function EditData() {
    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/production">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Designed Production Form</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Designed Production Form Form</p>
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
                            <DropdownProductForm
                                label="Product *"
                                options={[]}
                                onSelect={() => ""}
                            />
                            <DropdownString
                                label="Production Status *"
                                options={["Mechanical Engineering"]}
                                onSelect={() => ""}
                            />
                            <DropdownString
                                label="PIC Production *"
                                options={["Mechanical Engineering"]}
                                onSelect={() => ""}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Information *"
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
                            buttonText="Change Designed Production"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}