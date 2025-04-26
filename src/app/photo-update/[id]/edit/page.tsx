"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchPhotoUpdateDetail } from "@/store/slice/photoUpdate/getDetailSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import DateInputForm from "@/components/common/input/DateInputFrom";
import TextAreaForm from "@/components/common/input/TextAreaForm";
import FileInputForm from "@/components/common/input/FileInputForm";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function EditData() {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = Number(params.id);
    
    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */
    
    const { photoUpdateDetail } = useAppSelector(state => state.photoUpdateDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchPhotoUpdateDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/photo-update">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Photo Update</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Photo Update Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={() => ""}
                                defaultValue={photoUpdateDetail?.productId}
                            />
                            <DropdownString
                                label="Category *"
                                options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                                onSelect={() => ""}
                                defaultValue={photoUpdateDetail?.category}
                            />
                            <DateInputForm
                                label="Date *"
                                defaultValue={
                                    photoUpdateDetail?.dateInput
                                        ? photoUpdateDetail.dateInput.split("T")[0]
                                        : ""
                                }
                            />
                        </div>  
                        <div className="grid grid-cols-1">
                            <TextAreaForm
                                label="Issue *"
                                placeholder="Example: Describe the issue"
                                rows={3}
                                defaultValue={photoUpdateDetail?.information}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Photo *"
                                acceptFile=".jpg,.jpeg,.png"
                                defaultFile={photoUpdateDetail?.picture}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={() => ""}
                            buttonText="Change Photo Update"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}