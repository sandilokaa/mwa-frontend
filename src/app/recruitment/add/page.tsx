"use client"

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { createdRecruitmentData } from "@/store/slice/recruitment/createSlice";

import InputForm from "@/components/common/input/InputForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const [division, setDivision] = useState("");
    const nameRef = useRef<HTMLInputElement>(null);
    const submissionDateRef = useRef<HTMLInputElement>(null);
    const joinDateRef = useRef<HTMLInputElement>(null);
    const positionRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {

        const isEmpty = 
            !nameRef.current?.value?.trim() ||
            !submissionDateRef.current?.value?.trim() ||
            !joinDateRef.current?.value?.trim() ||
            !positionRef.current?.value?.trim() ||
            !division;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        try {
            const payload = {
                name: nameRef.current?.value || '',
                joinDate: joinDateRef.current?.value || '',
                submissionDate: submissionDateRef.current?.value || '',
                position: positionRef.current?.value || '',
                division
            };
            
            dispatch(createdRecruitmentData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/recruitment");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/recruitment">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Recruitment</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Recruitment Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Name *"  
                                placeholder="Example: Dafina Zahra Keisha"
                                ref={nameRef}
                            />
                            <DateInputForm
                                label="Submission Date *"
                                ref={submissionDateRef}
                            />
                            <DateInputForm
                                label="Join Date *"
                                ref={joinDateRef}
                            />
                        </div>  
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="Position *"  
                                placeholder="Example: RnE"
                                ref={positionRef}
                            />
                            <DropdownString
                                label="Division *"
                                options={["Vehicle Engineering", "System Engineering", "Industrial Design", "Testing"]}
                                onSelect={(value) => setDivision(value)}
                            />
                        </div>
                    </div> 
                    <div className="flex justify-end">
                        <SubmitButton
                            buttonText="Add Recruitment"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
