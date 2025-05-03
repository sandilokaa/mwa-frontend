"use client"

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductionDetail, ProductionStatus } from "@/store/slice/production/getDetailSlice";

import DocumentBadge from "@/components/common/badge/DocumentBadge";

export default function DetailData() {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = Number(params.id);

    const { productionDetail } = useAppSelector(state => state.productionDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductionDetail({ id }));
        }
    }, [id, dispatch]);


    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/production/">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Designed Production Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Designed Production Information</p>
                        <Link className="cursor-pointer" href={`/development-status/production/${id}/edit`}>
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4 mt-5 font-medium">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Part Name</p>
                                <p>{productionDetail?.partName}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">PIC Production</p>
                                <p>{productionDetail?.picProduction}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Drawing Number</p>
                                <p>{productionDetail?.drawingNumber}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Category</p>
                                <p>{productionDetail?.category}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Information</p>
                                <p>{productionDetail?.information}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Supporting Documents</p>
                                <DocumentBadge
                                    text="blablabla"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full rounded-[10px] p-5 self-start">
                    <p className="text-sm font-bold">Designed Production Status</p>
                    <div className="mt-4">
                        <p
                            className={`
                                text-sm font-medium inline-block py-[10px] px-4 rounded-[5px]
                                ${productionDetail?.productionStatus === ProductionStatus.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                ${productionDetail?.productionStatus === ProductionStatus.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                ${productionDetail?.productionStatus === ProductionStatus.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                            `}
                        >
                            {productionDetail?.productionStatus.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}