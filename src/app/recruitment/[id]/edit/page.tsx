"use client"

import Image from "next/image";
import Link from "next/link";
import InputForm from "@/components/common/input/InputForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import SubmitButton from "@/components/common/button/SubmitButton";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchRecruitmentDetail } from "@/store/slice/recruitment/getDetailSlice";
import { updateRecruitmentData } from "@/store/slice/recruitment/updateSlice";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import DropdownString from "@/components/common/dropdown/DropdownString";

export default function EditData() {

    
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    /* ------------------ Get Detail ------------------ */

    const { recruitmentDetail } = useAppSelector(state => state.recruitmentDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchRecruitmentDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */
    const nameRef = useRef<HTMLInputElement>(null);
    const submissionDateRef = useRef<HTMLInputElement>(null);
    const joinDateRef = useRef<HTMLInputElement>(null);
    const positionRef = useRef<HTMLInputElement>(null);
    const [division, setDivision] = useState("");

    const handleUpdate = () => {
        try {
            if (!recruitmentDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: recruitmentDetail?.id,
                name: nameRef.current?.value || '',
                joinDate: joinDateRef.current?.value || '',
                submissionDate: submissionDateRef.current?.value || '',
                position: positionRef.current?.value || '',
                division: division
            };
            dispatch(updateRecruitmentData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/recruitment");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/recruitment">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Recruitment</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Recruitment Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Name *"  
                                placeholder="Example: Dafina Zahra Keisha"
                                defaultValue={recruitmentDetail?.name}
                                ref={nameRef}
                            />
                            <DateInputForm
                                label="Submission Date *"
                                defaultValue={
                                    recruitmentDetail?.submissionDate
                                        ? recruitmentDetail.submissionDate.split("T")[0]
                                        : ""
                                }
                                ref={submissionDateRef}
                            />
                            <DateInputForm
                                label="Join Date *"
                                defaultValue={
                                    recruitmentDetail?.joinDate
                                        ? recruitmentDetail.joinDate.split("T")[0]
                                        : ""
                                }
                                ref={joinDateRef}
                            />
                        </div>  
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="Position"
                                placeholder="Example: Rne"
                                defaultValue={recruitmentDetail?.position}
                                ref={positionRef}
                            />
                            <DropdownString
                                label="Division *"
                                options={["Vehicle Engineering", "System Engineering", "Industrial Design", "Testing"]}
                                onSelect={(value) => setDivision(value)}
                                defaultValue={recruitmentDetail?.division}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            buttonText="Save Change"
                            onClick={handleUpdate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}