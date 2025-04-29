"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssueDetail } from "@/store/slice/highlightIssue/getDetailSlice";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { updateIssueData } from "@/store/slice/highlightIssue/updateSlice";


import InputForm from "@/components/common/input/InputForm";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";

export default function EditData() {
    
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);
    
    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */
    
    const { issueDetail } = useAppSelector(state => state.issueDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchIssueDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */
    
    const [category, setCategory] = useState("");
    const [pic, setPIC] = useState("");
    const dueDateRef = useRef<HTMLInputElement>(null);
    const itemNameRef = useRef<HTMLInputElement>(null);
    const countermeassureRef = useRef<HTMLTextAreaElement | null>(null);
    const issueRef = useRef<HTMLTextAreaElement | null>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleUpdate = () => {
        try {
            if (!issueDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: issueDetail?.id,
                productId: selectedProductIdRef.current,
                itemName: itemNameRef.current?.value || '',
                dueDate: dueDateRef.current?.value || '',
                issue: issueRef.current?.value || '',
                countermeassure: countermeassureRef.current?.value || '',
                category,
                pic
            };
            dispatch(updateIssueData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/highlight-issue");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */


    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/highlight-issue">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Highlight Issue</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Highlight Issue Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <InputForm
                                    label="Item Name *"
                                    placeholder="Example: Chassis Assy"
                                    defaultValue={issueDetail?.itemName}
                                    ref={itemNameRef}
                                />
                            </div>
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior", "Production"]}
                                onSelect={(value) => setCategory(value)}
                                defaultValue={issueDetail?.category}
                            />
                            <DropdownString
                                label="PIC (C/M) *"
                                options={["RnE Issue", "Vehicle Engineering Issue", "System Engineering Issue", "Industrial Design Issue" , "Production Issue", "Procurement Issue", "Testing Issue"]}
                                onSelect={(value) => setPIC(value)}
                                defaultValue={issueDetail?.pic}
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Issue *"
                                placeholder="Example: Describe the issue"
                                rows={2}
                                defaultValue={issueDetail?.issue}
                                ref={issueRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Countermeassure (C/M) *"
                                placeholder="Example: Describe the countermeassure"
                                rows={2}
                                defaultValue={issueDetail?.countermeassure}
                                ref={countermeassureRef}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                                defaultValue={issueDetail?.productId}
                            />
                            <DateInputForm
                                label="Date *"
                                defaultValue={
                                    issueDetail?.dueDate
                                        ? issueDetail.dueDate.split("T")[0]
                                        : ""
                                }
                                ref={dueDateRef}
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