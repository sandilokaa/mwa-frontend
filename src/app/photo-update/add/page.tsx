"use client"

import Image from "next/image";
import Link from "next/link";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import Dropdown from "@/components/common/dropdown/DropdownForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import FileInputForm from "@/components/common/input/FileInputForm";

export default function AddData() {

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/photo-update">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Photo Update</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Photo Update Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Dropdown
                                label="Product *"
                                options={[]}
                                onSelect={() => ""}
                            />
                            <Dropdown
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                                onSelect={() => ""}
                            />
                            <DateInputForm
                                label="Date *"
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Issue *"
                                placeholder="Example: Describe the issue"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Photo *"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            buttonText="Add Photo Update"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}