"use client"

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { createdProductData } from "@/store/slice/product/createSlice";

import TextAreaForm from "@/components/common/input/TextAreaForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import FileInputForm from "@/components/common/input/FileInputForm";
import InputForm from "@/components/common/input/InputForm";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    
    const nameRef = useRef<HTMLInputElement>(null);
    const taglineRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const pictureRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const isEmpty = 
            !nameRef.current?.value?.trim() ||
            !taglineRef.current?.value?.trim() ||
            !descriptionRef.current?.value?.trim() ||
            !pictureRef.current?.files?.[0]
        ;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        try {
            const payload = {
                name: nameRef.current?.value || '',
                tagline: taglineRef.current?.value || '',
                description: descriptionRef.current?.value || '',
                picture: pictureRef.current?.files?.[0] || '',

            };
            dispatch(createdProductData(payload));
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/product");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/product">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Product</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Product Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="Product Name *"  
                                placeholder="Example: Bhadrika"
                                ref={nameRef}
                            />
                            <InputForm
                                label="Tagline *"  
                                placeholder="Example: Unmanned Aerial Vehicle"
                                ref={taglineRef}
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Description *"
                                placeholder="Example: Describe the description"
                                rows={3}
                                ref={descriptionRef}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Photo *"
                                acceptFile=".jpg,.jpeg,.png"
                                ref={pictureRef}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            buttonText="Add Product"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}