"use client"

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchBudgetLimitDetail } from "@/store/slice/budgetStatus/limit/getDetailSlice";
import { updateBudgetLimitData } from "@/store/slice/budgetStatus/limit/updateSlice";

import InputForm from "@/components/common/input/InputForm";
import SubmitButton from "@/components/common/button/SubmitButton";
import DropdownProductForm from "@/components/common/dropdown/DropdownProductForm";
import DropdownMonth from "@/components/common/dropdown/DropdownMonth";
import DropdownYear from "@/components/common/dropdown/DropdownYear";

export default function EditData() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const id = Number(params.id);

    const { products } = useAppSelector((state) => state.productList);

    /* ------------------ Get Detail ------------------ */
    
    const { budgetLimitDetail } = useAppSelector(state => state.budgetLimitDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchBudgetLimitDetail({ id }));
        }
    }, [id, dispatch]);

    /* ------------------ End Get Detail ------------------ */


    /* ------------------ Update Budget Limit Detail ------------------ */

    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const systemRef = useRef<HTMLInputElement>(null);
    const limitRef = useRef<HTMLInputElement>(null);
    const selectedProductIdRef = useRef<number>(0);

    useEffect(() => {
        if (!budgetLimitDetail) return;
        setMonth(budgetLimitDetail?.month ?? "");
        setYear(budgetLimitDetail?.year ?? "");
    }, [budgetLimitDetail]);

    useEffect(() => {
        if (budgetLimitDetail?.productId) {
            selectedProductIdRef.current = budgetLimitDetail.productId;
        }
    }, [budgetLimitDetail]);

    const handleUpdate = () => {
        try {
            if (!budgetLimitDetail?.id) {
                throw new Error("Procurement ID is required");
            }

            const payload = {
                id: budgetLimitDetail?.id,
                productId: selectedProductIdRef.current,
                system: systemRef.current?.value || '',
                limit: Number(limitRef.current?.value) || 0,
                month,
                year,
            };

            console.log(payload)

            dispatch(updateBudgetLimitData(payload));
            enqueueSnackbar("You have successfully updated the data", { variant: "success" });

            router.push("/budget-status/monthly-result");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    /* ------------------ End Update Budget Limit Detail ------------------ */

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/budget-status/monthly-result">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Add Budget Limit</p>
            </div>
            <div className="mt-5 bg-white w-full rounded-[10px] p-5">
                <p className="text-sm font-bold">Budget Limit Form</p>
                <div className="flex flex-col gap-y-5 mt-5">
                    <div className="flex flex-col gap-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownProductForm
                                label="Product *"
                                options={products}
                                onSelect={(value) => {
                                    selectedProductIdRef.current = value.id;
                                }}
                                defaultValue={budgetLimitDetail?.productId}
                            />
                            <InputForm
                                label="System *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={budgetLimitDetail?.system}
                                ref={systemRef}
                            />
                            <InputForm
                                label="Limit *"
                                placeholder="Example: Chassis Assy"
                                defaultValue={String(budgetLimitDetail?.limit)}
                                ref={limitRef}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <DropdownMonth
                                label="Month *"
                                onSelect={(value) => {setMonth(value)}}
                                value={month}
                            />
                            <DropdownYear
                                label="Year *"    
                                onSelect={(value) => {setYear(value)}}
                                value={year}
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