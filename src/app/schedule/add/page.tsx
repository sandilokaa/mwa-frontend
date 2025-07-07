"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { createdScheduleData } from "@/store/slice/schedule/createSlice";

import InputForm from "@/components/common/input/InputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DateInputForm from "@/components/common/input/DateInputFrom";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const [pic, setPIC] = useState("");
    const scheduleNameRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !scheduleNameRef.current?.value?.trim() ||
            !startDateRef.current?.value?.trim() ||
            !endDateRef.current?.value?.trim() ||
            !pic
        ;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        try {
            const payload = {
                productId: selectedProductIdRef.current,
                scheduleName: scheduleNameRef.current?.value || '',
                startDate: startDateRef.current?.value || '',
                endDate: endDateRef.current?.value || '',
                pic
            };
            dispatch(createdScheduleData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/schedule");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

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
                                placeholder="Example: Design Concept"
                                ref={scheduleNameRef}
                            />
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
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
                                ref={startDateRef}
                            />
                            <DateInputForm
                                label="End Date *"
                                ref={endDateRef}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            buttonText="Add Schedule"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}