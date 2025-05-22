"use client"

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { createdEngineeringData } from "@/store/slice/engineering/createSlice";

import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DateInputForm from "@/components/common/input/DateInputFrom";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const [pic3D, setPIC3D] = useState("");
    const [pic2DDXF, setPIC2DDXF] = useState("");
    const [category, setCategory] = useState("");
    const partNameRef = useRef<HTMLInputElement>(null);
    const drawingNumberRef = useRef<HTMLInputElement>(null);
    const remarkRef = useRef<HTMLTextAreaElement | null>(null);
    const pictureRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const dateRequiredRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);


    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !partNameRef.current?.value?.trim() ||
            !category ||
            !drawingNumberRef.current?.value?.trim() ||
            !remarkRef.current?.value?.trim() ||
            !priceRef.current?.value?.trim() ||
            !quantityRef.current?.value?.trim() ||
            !startDateRef.current?.value?.trim() ||
            !dateRequiredRef.current?.value?.trim() ||
            !pictureRef.current?.files?.[0] ||
            !pic3D ||
            !pic2DDXF
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
                remark: remarkRef.current?.value || '',
                price: priceRef.current?.value || '',
                quantity: quantityRef.current?.value || '',
                startDate: startDateRef.current?.value || '',
                dateRequired: dateRequiredRef.current?.value || '',
                picture: pictureRef.current?.files?.[0] || '',
                pic3D,
                pic2DDXF
            };
            
            dispatch(createdEngineeringData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/development-status/engineering");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/engineering">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Design Engineering</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Design Engineering Form</p>
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
                                placeholder="Example: R-MWR-V6x6-1.0 001 000"
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
                                placeholder="Example: 123456789"
                                ref={priceRef}
                            />
                            <InputForm
                                label="Quantity *"
                                placeholder="Example: 123456789"
                                ref={quantityRef}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DateInputForm
                                label="Start Date *"
                                ref={startDateRef}
                            />
                            <DateInputForm
                                label="Required Date *"
                                ref={dateRequiredRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Remarks *"
                                placeholder="Example: Describe the remark"
                                rows={3}
                                ref={remarkRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Documents *"
                                acceptFile=".jpg,.jpeg,.png"
                                ref={pictureRef}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            buttonText="Add Design Engineering"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}