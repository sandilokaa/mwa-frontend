"use client"

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { createdPartDesignData } from "@/store/slice/partDesign/createSlice";


import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";
import FileInputForm from "@/components/common/input/FileInputForm";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const [category, setCategory] = useState("");
    const nameRef = useRef<HTMLInputElement>(null);
    const pictureRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !nameRef.current?.value?.trim() ||
            !category ||
            !pictureRef.current?.files?.[0]
        ;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        try {
            const payload = {
                productId: selectedProductIdRef.current,
                name: nameRef.current?.value || '',
                category,
                picture: pictureRef.current?.files?.[0] || ''
            };
            
            dispatch(createdPartDesignData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/development-status/styling-design");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/styling-design">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Part Design</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Part Design Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Part Design Name *"
                                placeholder="Example: Chassis Assy"
                                ref={nameRef}
                            />
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                                onSelect={(value) => setCategory(value)}
                                value={category}
                            />
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
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
                            buttonText="Add Styling Design"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}