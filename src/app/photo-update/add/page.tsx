"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { createdPhotoUpdateData } from "@/store/slice/photoUpdate/createSlice";

import TextAreaForm from "@/components/common/input/TextAreaForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DateInputForm from "@/components/common/input/DateInputFrom";
import FileInputForm from "@/components/common/input/FileInputForm";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const [category, setCategory] = useState("");
    const dateInputRef = useRef<HTMLInputElement>(null);
    const informationRef = useRef<HTMLTextAreaElement | null>(null);
    const pictureRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !dateInputRef.current?.value?.trim() ||
            !informationRef.current?.value?.trim() ||
            !pictureRef.current?.files?.[0] ||
            !category
        ;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        try {
            const payload = {
                productId: selectedProductIdRef.current,
                dateInput: dateInputRef.current?.value || '',
                information: informationRef.current?.value || '',
                picture: pictureRef.current?.files?.[0] || '',
                category,

            };
            dispatch(createdPhotoUpdateData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/photo-update");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/photo-update">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Photo Update</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Photo Update Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                            />
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                                onSelect={(value) => setCategory(value)}
                            />
                            <DateInputForm
                                label="Date *"
                                ref={dateInputRef}
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Issue *"
                                placeholder="Example: Describe the issue"
                                rows={3}
                                ref={informationRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Photo *"
                                ref={pictureRef}
                                acceptFile=".jpg,.jpeg,.png"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            buttonText="Add Photo Update"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}