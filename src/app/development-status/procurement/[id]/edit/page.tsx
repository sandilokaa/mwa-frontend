"use client"

import Image from "next/image";
import Link from "next/link";
import InputForm from "@/components/common/input/InputForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchProcurementDetail } from "@/store/slice/procurement/getDetailSlice";
import { updateProcurementData } from "@/store/slice/procurement/updateSlice";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function EditData() {

    
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);
    
    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */

    const { procurementDetail } = useAppSelector(state => state.procurementDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProcurementDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */

    const itemNameRef = useRef<HTMLInputElement>(null);
    const submissionDateRef = useRef<HTMLInputElement>(null);
    const etaTargetRef = useRef<HTMLInputElement>(null);
    const prNumberRef = useRef<HTMLInputElement>(null);
    const poNumberRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const vendorRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleUpdate = () => {
        try {
            if (!procurementDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: procurementDetail?.id,
                productId: selectedProductIdRef.current,
                itemName: itemNameRef.current?.value || '',
                prNumber: prNumberRef.current?.value || '',
                poNumber: poNumberRef.current?.value || '',
                vendor: vendorRef.current?.value || '',
                quantity: quantityRef.current?.value || '',
                submissionDate: submissionDateRef.current?.value || '',
                etaTarget: etaTargetRef.current?.value || '',
            };
            dispatch(updateProcurementData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/development-status/procurement");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/procurement">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Procurement</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Procurement Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Item name *"  
                                placeholder="Example: Hilux Single Cabin 4x4"
                                defaultValue={procurementDetail?.itemName}
                                ref={itemNameRef}
                            />
                            <DateInputForm
                                label="Submission Date *"
                                defaultValue={
                                    procurementDetail?.submissionDate
                                        ? procurementDetail.submissionDate.split("T")[0]
                                        : ""
                                }
                                ref={submissionDateRef}
                            />
                            <DateInputForm
                                label="ETA Target *"
                                defaultValue={
                                    procurementDetail?.etaTarget
                                        ? procurementDetail.etaTarget.split("T")[0]
                                        : ""
                                }
                                ref={etaTargetRef}
                            />
                        </div>  
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="PR Number *"
                                placeholder="Example: PR-BDG-03003"
                                defaultValue={procurementDetail?.prNumber}
                                ref={prNumberRef}
                            />
                            <InputForm
                                label="PO Number *"
                                placeholder="Example: PO-BDG-01715"
                                defaultValue={procurementDetail?.poNumber}
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
                                defaultValue={procurementDetail?.productId}
                            />
                            <InputForm
                                label="Quantity *"
                                placeholder="Example: 1"
                                defaultValue={procurementDetail?.quantity}
                                ref={quantityRef}
                            />
                            <InputForm
                                label="Vendor *"
                                placeholder="Example: Josh Hollong"
                                defaultValue={procurementDetail?.vendor}
                                ref={vendorRef}
                            />
                        </div> 
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            buttonText="Add Procurement"
                            onClick={handleUpdate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}