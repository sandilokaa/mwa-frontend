"use client"

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useSnackbar } from "notistack";
import { useRouter, useParams } from "next/navigation";
import { fetchScheduleDetail } from "@/store/slice/schedule/getDetailSlice";
import { updateScheduleData } from "@/store/slice/schedule/updateSlice";

import InputForm from "@/components/common/input/InputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DateInputForm from "@/components/common/input/DateInputFrom";

export default function EditData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */
    
    const { scheduleDetail } = useAppSelector(state => state.scheduleDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchScheduleDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */

    const [pic, setPIC] = useState("");

    useEffect(() => {
        if (!scheduleDetail) return;
        setPIC(scheduleDetail?.pic ?? "");
    }, [scheduleDetail]);

    const scheduleNameRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleUpdate = () => {
        try {
            if (!scheduleDetail?.id) {
                throw new Error("Schedule ID is required");
            }

            const payload = {
                id: scheduleDetail?.id,
                productId: selectedProductIdRef.current,
                scheduleName: scheduleNameRef.current?.value || '',
                startDate: startDateRef.current?.value || '',
                endDate: endDateRef.current?.value || '',
                pic,
            };

            dispatch(updateScheduleData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/schedule");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */


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
                                defaultValue={scheduleDetail?.scheduleName}
                            />
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                                defaultValue={scheduleDetail?.productId}
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
                                defaultValue={
                                    scheduleDetail?.startDate
                                        ? scheduleDetail.startDate.split("T")[0]
                                        : ""
                                }
                            />
                            <DateInputForm
                                label="End Date *"
                                ref={endDateRef}
                                defaultValue={
                                    scheduleDetail?.endDate
                                        ? scheduleDetail.endDate.split("T")[0]
                                        : ""
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleUpdate}
                            buttonText="Save Change"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}