"use client"

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { createdProductionData } from "@/store/slice/production/createSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

import SubmitButton from "@/components/common/button/SubmitButton";
import InputForm from "@/components/common/input/InputForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const [picProduction, setPICProduction] = useState("");
    const [category, setCategory] = useState("");
    const partNameRef = useRef<HTMLInputElement>(null);
    const drawingNumberRef = useRef<HTMLInputElement>(null);
    const remarkRef = useRef<HTMLTextAreaElement | null>(null);
    const prodFileRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !partNameRef.current?.value?.trim() ||
            !category ||
            !drawingNumberRef.current?.value?.trim() ||
            !remarkRef.current?.value?.trim() ||
            !prodFileRef.current?.files?.[0] ||
            !picProduction
        ;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        try {
            const payload = {
                productId: selectedProductIdRef.current,
                partName: partNameRef.current?.value || '',
                category,
                drawingNumber: drawingNumberRef.current?.value || '',
                picProduction,
                remark: remarkRef.current?.value || '',
                prodFile: prodFileRef.current?.files?.[0] || '',
            };
            
            dispatch(createdProductionData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/development-status/production");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/production">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Designed Production</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Designed Production Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Part Name *"
                                placeholder="Example: Chassis Assy"
                                ref={partNameRef}
                            />
                            <InputForm
                                label="Drawing Number *"
                                placeholder="Example: Chassis Assy"
                                ref={drawingNumberRef}
                            />
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body"]}
                                onSelect={(value) => setCategory(value)}
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
                            <DropdownString
                                label="PIC Production *"
                                options={["Mechanical Engineering"]}
                                onSelect={(value) => setPICProduction(value)}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Remarks *"
                                placeholder="Example: Describe the remarks"
                                rows={3}
                                ref={remarkRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Photo *"
                                acceptFile=".jpg,.jpeg,.png"
                                ref={prodFileRef}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            buttonText="Add Designed Production"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}