"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter, useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { fetchProductDetail } from "@/store/slice/product/getDetailSlice";
import { updateProductData } from "@/store/slice/product/updateSlice";

import TextAreaForm from "@/components/common/input/TextAreaForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import FileInputForm from "@/components/common/input/FileInputForm";
import InputForm from "@/components/common/input/InputForm";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    /* ------------------ Get Detail ------------------ */

    const { productDetail } = useAppSelector(state => state.productDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */

    const nameRef = useRef<HTMLInputElement>(null);
    const taglineRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const pictureRef = useRef<HTMLInputElement>(null);

    const handleUpdate = () => {
        try {
            if (!productDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: productDetail?.id,
                name: nameRef.current?.value || '',
                tagline: taglineRef.current?.value || '',
                description: descriptionRef.current?.value || '',
                picture: pictureRef.current?.files?.[0] || '',
            };

            dispatch(updateProductData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/product");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/product">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Product</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Product Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm
                                label="Product Name *"  
                                defaultValue={productDetail?.name}
                                ref={nameRef}
                            />
                            <InputForm
                                label="Tagline *"  
                                defaultValue={productDetail?.tagline}
                                ref={taglineRef}
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Description *"
                                defaultValue={productDetail?.description}
                                ref={descriptionRef}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Photo *"
                                acceptFile=".jpg,.jpeg,.png"
                                defaultFile={productDetail?.picture}
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