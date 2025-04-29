"use client"

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createdIssueData } from "@/store/slice/highlightIssue/createSlice";

import InputForm from "@/components/common/input/InputForm";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const [category, setCategory] = useState("");
    const [pic, setPIC] = useState("");
    const dueDateRef = useRef<HTMLInputElement>(null);
    const itemNameRef = useRef<HTMLInputElement>(null);
    const countermeassureRef = useRef<HTMLTextAreaElement | null>(null);
    const issueRef = useRef<HTMLTextAreaElement | null>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !itemNameRef.current?.value?.trim() ||
            !dueDateRef.current?.value?.trim() ||
            !countermeassureRef.current?.value?.trim() ||
            !issueRef.current?.value?.trim() ||
            !category ||
            !pic
        ;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        try {
            const payload = {
                productId: selectedProductIdRef.current,
                itemName: itemNameRef.current?.value || '',
                dueDate: dueDateRef.current?.value || '',
                issue: issueRef.current?.value || '',
                countermeassure: countermeassureRef.current?.value || '',
                category,
                pic
            };
            dispatch(createdIssueData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/highlight-issue");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

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
                                    ref={itemNameRef}
                                />
                            </div>
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior", "Production"]}
                                onSelect={(value) => setCategory(value)}
                            />
                            <DropdownString
                                label="PIC (C/M) *"
                                options={["RnE Issue", "Vehicle Engineering Issue", "System Engineering Issue", "Industrial Design Issue" , "Production Issue", "Procurement Issue", "Testing Issue"]}
                                onSelect={(value) => setPIC(value)}
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Issue *"
                                placeholder="Example: Describe the issue"
                                rows={2}
                                ref={issueRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Countermeassure (C/M) *"
                                placeholder="Example: Describe the countermeassure"
                                rows={2}
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
                            />
                            <DateInputForm
                                label="Due Date *"
                                ref={dueDateRef}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            buttonText="Add Highlight Issue"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}