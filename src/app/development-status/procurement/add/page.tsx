"use client"

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SubmitButton from "@/components/common/button/SubmitButton";
import InputForm from "@/components/common/input/InputForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import { createdProcurementData } from "@/store/slice/procurement/createSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const itemNameRef = useRef<HTMLInputElement>(null);
    const submissionDateRef = useRef<HTMLInputElement>(null);
    const etaTargetRef = useRef<HTMLInputElement>(null);
    const prNumberRef = useRef<HTMLInputElement>(null);
    const poNumberRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const vendorRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        try {
            if (selectedProductIdRef.current === null) {
                throw new Error("Product ID is required");
            }
    
            const payload = {
                productId: selectedProductIdRef.current,
                itemName: itemNameRef.current?.value || '',
                prNumber: prNumberRef.current?.value || '',
                poNumber: poNumberRef.current?.value || '',
                vendor: vendorRef.current?.value || '',
                quantity: quantityRef.current?.value || '',
                submissionDate: submissionDateRef.current?.value || '',
                etaTarget: etaTargetRef.current?.value || '',
            };
            dispatch(createdProcurementData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/development-status/procurement");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };
    

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/procurement">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Procurement</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Procurement Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Item name *"  
                                placeholder="Example: Hilux Single Cabin 4x4"
                                ref={itemNameRef}
                            />
                            <DateInputForm
                                label="Submission Date *"
                                ref={submissionDateRef}
                            />
                            <DateInputForm
                                label="ETA Target *"
                                ref={etaTargetRef}
                            />
                        </div>  
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="PR Number *"
                                placeholder="Example: PR-BDG-03003"
                                ref={prNumberRef}
                            />
                            <InputForm
                                label="PO Number *"
                                placeholder="Example: PO-BDG-01715"
                                ref={poNumberRef}
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
                            <InputForm
                                label="Quantity *"
                                placeholder="Example: 1"
                                ref={quantityRef}
                            />
                            <InputForm
                                label="Vendor *"
                                placeholder="Example: Josh Hollong"
                                ref={vendorRef}
                            />
                        </div> 
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            buttonText="Add Procurement"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}