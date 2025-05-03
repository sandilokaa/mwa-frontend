"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { fetchProductionDetail } from "@/store/slice/production/getDetailSlice";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { updateProductionData } from "@/store/slice/production/updateSlice";

import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);
    
    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */

    const { productionDetail } = useAppSelector(state => state.productionDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductionDetail({ id }));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (productionDetail?.productId) {
            selectedProductIdRef.current = productionDetail.productId;
        }
    }, [productionDetail]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */

    const [picProduction, setPICProduction] = useState("");
    const [category, setCategory] = useState("");
    const partNameRef = useRef<HTMLInputElement>(null);
    const drawingNumberRef = useRef<HTMLInputElement>(null);
    const informationRef = useRef<HTMLTextAreaElement | null>(null);
    const prodFileRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleUpdate = () => {
        try {
            if (!productionDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: productionDetail?.id,
                productId: selectedProductIdRef.current,
                partName: partNameRef.current?.value || '',
                drawingNumber: drawingNumberRef.current?.value || '',
                category,
                information: informationRef.current?.value || '',
                prodFile: prodFileRef.current?.files?.[0] || '',
                picProduction,
            };

            dispatch(updateProductionData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/development-status/production");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/production">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Designed Production Form</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Designed Production Form Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Part Name *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={productionDetail?.partName}
                                ref={partNameRef}
                            />
                            <InputForm
                                label="Drawing Number *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={productionDetail?.drawingNumber}
                                ref={drawingNumberRef}
                            />
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body"]}
                                onSelect={(value) => setCategory(value)}
                                defaultValue={productionDetail?.category}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                                defaultValue={productionDetail?.productId}
                            />
                            <DropdownString
                                label="PIC Production *"
                                options={["Mechanical Engineering"]}
                                onSelect={(value) => setPICProduction(value)}
                                defaultValue={productionDetail?.picProduction}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Information *"
                                placeholder="Example: Describe the remark"
                                rows={3}
                                defaultValue={productionDetail?.information}
                                ref={informationRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Documents *"
                                acceptFile=".pdf"
                                defaultFile={productionDetail?.prodFile}
                                ref={prodFileRef}
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