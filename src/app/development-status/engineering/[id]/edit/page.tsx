"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState, useRef } from "react";
import { fetchEngineeringDetail } from "@/store/slice/engineering/getDetailSlice";
import { updateEngineeringData } from "@/store/slice/engineering/updateSlice";

import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DateInputForm from "@/components/common/input/DateInputFrom";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */

    const { engineeringDetail } = useAppSelector(state => state.engineeringDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchEngineeringDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */

    const [pic3D, setPIC3D] = useState("");
    const [pic2DDXF, setPIC2DDXF] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (!engineeringDetail) return;
        setPIC3D(engineeringDetail?.pic3D ?? "");
        setPIC2DDXF(engineeringDetail?.pic2DDXF ?? "");
        setCategory(engineeringDetail?.category ?? "");
    }, [engineeringDetail]);


    const partNameRef = useRef<HTMLInputElement>(null);
    const drawingNumberRef = useRef<HTMLInputElement>(null);
    const remarkRef = useRef<HTMLTextAreaElement | null>(null);
    const pictureRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const dateRequiredRef = useRef<HTMLInputElement>(null);

    const selectedProductIdRef = useRef<number>(0);

    useEffect(() => {
        if (engineeringDetail?.productId) {
            selectedProductIdRef.current = engineeringDetail.productId;
        }
    }, [engineeringDetail]);

    const handleUpdate = () => {
        try {
            if (!engineeringDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: engineeringDetail?.id,
                productId: selectedProductIdRef.current,
                partName: partNameRef.current?.value || '',
                category,
                drawingNumber: drawingNumberRef.current?.value || '',
                remark: remarkRef.current?.value || '',
                price: priceRef.current?.value || '',
                quantity: quantityRef.current?.value || '',
                startDate: startDateRef.current?.value || '',
                dateRequired: dateRequiredRef.current?.value || '',
                picture: pictureRef.current?.files?.[0] || '',
                pic3D,
                pic2DDXF,
            };

            dispatch(updateEngineeringData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/development-status/engineering");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/engineering">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Design Engineering</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Design Engineering Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Part Name *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={engineeringDetail?.partName}
                                ref={partNameRef}
                            />
                            <InputForm
                                label="Drawing Number *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={engineeringDetail?.drawingNumber}
                                ref={drawingNumberRef}
                            />
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                                onSelect={(value) => setCategory(value)}
                                value={category}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                                defaultValue={engineeringDetail?.productId}
                            />
                            <DropdownString
                                label="PIC 3D *"
                                options={["RnE", "Vehicle Engineering", "System Engineering", "Industrial Engineering", "Testing"]}
                                onSelect={(value) => setPIC3D(value)}
                                value={pic3D}
                            />
                            <DropdownString
                                label="PIC 2D & DXF *"
                                options={["RnE", "Vehicle Engineering", "System Engineering", "Industrial Engineering", "Testing"]}
                                onSelect={(value) => setPIC2DDXF(value)}
                                value={pic2DDXF}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Price *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={engineeringDetail?.price}
                                ref={priceRef}
                            />
                            <InputForm
                                label="Quantity *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={engineeringDetail?.quantity}
                                ref={quantityRef}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DateInputForm
                                label="Start Date *"
                                defaultValue={
                                    engineeringDetail?.startDate
                                        ? engineeringDetail.startDate.split("T")[0]
                                        : ""
                                }
                                ref={startDateRef}
                            />
                            <DateInputForm
                                label="Required Date *"
                                defaultValue={
                                    engineeringDetail?.dateRequired
                                        ? engineeringDetail.dateRequired.split("T")[0]
                                        : ""
                                }
                                ref={dateRequiredRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Remarks *"
                                placeholder="Example: Describe the remark"
                                rows={3}
                                defaultValue={engineeringDetail?.remark}
                                ref={remarkRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Documents *"
                                acceptFile=".jpg,.jpeg,.png"
                                defaultFile={engineeringDetail?.picture}
                                ref={pictureRef}
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