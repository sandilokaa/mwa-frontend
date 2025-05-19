"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useParams } from "next/navigation";
import { fetchStylingDesignDetail } from "@/store/slice/stylingDesign/getDetailSlice";
import { useEffect, useState } from "react";

import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */
    
    const { stylingDesignDetail } = useAppSelector(state => state.stylingDesignDetail);

    console.log(stylingDesignDetail)
    useEffect(() => {
        if (id) {
            dispatch(fetchStylingDesignDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/styling-design">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Styling Design</p>
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
                                    defaultValue={stylingDesignDetail?.name}
                                />
                            </div>
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={() => ""}
                                defaultValue={stylingDesignDetail?.productId}
                            />
                        </div>
                        
                    </div>
                    <div className="flex justify-end">
                        <SubmitButton
                            onClick={() => ""}
                            buttonText="Save Change"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}