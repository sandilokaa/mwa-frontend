"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useState, useRef } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { createdStylingDesignData } from "@/store/slice/stylingDesign/createSlice";

import InputForm from "@/components/common/input/InputForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);

    const [fileInputs, setFileInputs] = useState<File[][]>([]);

    const handleAddFileInput = () => {
        setFileInputs(prev => [...prev, []]);
    };

    const handleFileChange = (file: File[], index: number): void => {
        const updatedFiles = [...fileInputs];
        updatedFiles[index] = file;
        setFileInputs(updatedFiles);
    };

    const removeFileInput = (index: number) => {
        setFileInputs(prev => prev.filter((_, i) => i !== index));
    };

    const nameRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !nameRef.current?.value?.trim()
        ;

        if (isEmpty) {
            enqueueSnackbar("All fields are required", { variant: "error" });
            return;
        }

        const allFiles: File[] = fileInputs.flat();

        if (allFiles.length === 0) {
            enqueueSnackbar("Please upload at least one file", { variant: "error" });
            return;
        }

        try {
            const payload = {
                productId: selectedProductIdRef.current,
                name: nameRef.current?.value || '',
                picture: allFiles,
            };
            dispatch(createdStylingDesignData(payload))
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
                <p className="font-bold">Add Styling Design</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Styling Design Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <InputForm
                                    label="Styling Design Name *"
                                    placeholder="Example: 6x6 Conversion Design"
                                    ref={nameRef}
                                />
                            </div>
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {fileInputs.map((_, index) => (
                                <div key={index} className="flex justify-between items-center gap-4">
                                    <div className="w-full">
                                        <FileInputForm
                                            key={index}
                                            label={`Upload Documents *`}
                                            acceptFile=".jpg,.jpeg,.png"
                                            onFileChange={(files: File[]) => handleFileChange(files, index)}
                                        />
                                    </div>
                                    <div 
                                        onClick={() => removeFileInput(index)}
                                        className="p-2 rounded-sm bg-[#D62C35] cursor-pointer h-fit"
                                    >
                                        <Image  src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="text-blue-600 text-sm mt-4 cursor-pointer"
                                onClick={handleAddFileInput}
                            >
                                + Add another file
                            </button>
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