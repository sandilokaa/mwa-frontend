"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { fetchProductionDetail } from "@/store/slice/production/getDetailSlice";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { updateProductionData } from "@/store/slice/production/updateSlice";

import DropdownString from "@/components/common/dropdown/DropdownString";
import SubmitButton from "@/components/common/button/SubmitButton";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    /* ------------------ Get Detail ------------------ */

    const { productionDetail } = useAppSelector(state => state.productionDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductionDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Data ------------------ */

    const [picProduction, setPICProduction] = useState("");

    useEffect(() => {
        if (!productionDetail) return;
        setPICProduction(productionDetail?.picProduction ?? "");
    }, [productionDetail]);

    const handleUpdate = () => {
        try {
            if (!productionDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: productionDetail?.id,
                picProduction,
            };

            dispatch(updateProductionData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/development-status/production");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Data ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/production">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Edit Designed Production Form</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Designed Production Form Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownString
                                label="PIC Production *"
                                options={["Production", "QA/QC"]}
                                value={picProduction}
                                onSelect={(value) => setPICProduction(value)}
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