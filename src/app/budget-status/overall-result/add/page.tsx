"use client"

import Image from "next/image";
import Link from "next/link";

import InputForm from "@/components/common/input/InputForm";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function AddData() {

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/budget-status/monthly-result">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Budget Status</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Budget Status Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="Product *"
                                placeholder="Example: Chassis Assy"
                            />
                            <InputForm
                                label="Budget Month *"
                                placeholder="Example: Chassis Assy"
                            />
                        </div>   
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={() => {}}
                            buttonText="Add Budget Status"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}