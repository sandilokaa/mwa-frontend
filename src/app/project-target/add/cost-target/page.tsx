"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import useFileInputs from "@/hooks/useFileInput";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useRef } from "react";
import { createdProjectTargetData } from "@/store/slice/projectTarget/createSlice";

import InputForm from "@/components/common/input/InputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import TextAreaForm from "@/components/common/input/TextAreaForm";

export default function AddData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const { products } = useAppSelector((state) => state.productList);
    
    const {
        fileInputs,
        handleAddFileInput,
        handleFileChange,
        removeFileInput
    } = useFileInputs();

    const nameRef = useRef<HTMLInputElement>(null);
    const informationRef = useRef<HTMLTextAreaElement | null>(null);
    const selectedProductIdRef = useRef<number>(0);

    const handleSubmit = () => {
        const isEmpty = 
            !selectedProductIdRef.current || 
            !informationRef.current?.value?.trim()
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
                name: 'Cost Target',
                information: informationRef.current?.value || '',
                picture: allFiles,
            };
            dispatch(createdProjectTargetData(payload))
            enqueueSnackbar("You have successfully created the data", { variant: "success" });

            router.push("/project-target");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/project-target">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Cost Target</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Cost Target Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <InputForm
                                    label="Cost Target Name *"
                                    placeholder="Example: 6x6 Conversion Design"
                                    ref={nameRef}
                                    defaultValue="Cost Target"
                                    disable
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
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Information *"
                                placeholder="Example: Describe the information"
                                rows={2}
                                ref={informationRef}
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
                            buttonText="Add Cost Target"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}