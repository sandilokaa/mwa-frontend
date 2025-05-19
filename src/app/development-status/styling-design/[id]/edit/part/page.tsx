"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState, useRef } from "react";
import { fetchPartDesignDetail } from "@/store/slice/partDesign/getDetailSlice";
import { updatePartDesignData } from "@/store/slice/partDesign/updateSlice";

import InputForm from "@/components/common/input/InputForm";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownString from "@/components/common/dropdown/DropdownString";
import FileInputForm from "@/components/common/input/FileInputForm";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */

    const { partDesignDetail } = useAppSelector(state => state.partDesignDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchPartDesignDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */

    const [category, setCategory] = useState("");

    useEffect(() => {
        if (!partDesignDetail) return;
        setCategory(partDesignDetail?.category ?? "");
    }, [partDesignDetail]);


    const nameRef = useRef<HTMLInputElement>(null);
    const pictureRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    useEffect(() => {
        if (partDesignDetail?.productId) {
            selectedProductIdRef.current = partDesignDetail.productId;
        }
    }, [partDesignDetail]);

    const handleUpdate = () => {
        try {
            if (!partDesignDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: partDesignDetail?.id,
                productId: selectedProductIdRef.current,
                name: nameRef.current?.value || '',
                picture: pictureRef.current?.files?.[0] || '',
                category,
            };

            dispatch(updatePartDesignData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/development-status/styling-design");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/styling-design">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Part Design</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Part Design Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputForm
                                label="Part Name *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={partDesignDetail?.name}
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
                                defaultValue={partDesignDetail?.productId}
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <FileInputForm
                                label="Upload Documents *"
                                acceptFile=".jpg,.jpeg,.png"
                                defaultFile={partDesignDetail?.picture}
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