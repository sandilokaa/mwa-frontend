"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProcurementDetail, Progress, StatusProc } from "@/store/slice/procurement/getDetailSlice";
import { formatProgressProc } from "@/utils/format/formatProgress";
import { formatDate } from "@/utils/format/formatDate";

export default function DetailData() {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = Number(params.id);

    const { procurementDetail } = useAppSelector(state => state.procurementDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProcurementDetail({ id }));
        }
    }, [id, dispatch]);

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/procurement">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Procurement Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Procurement Information</p>
                        <Link className="cursor-pointer" href={`/development-status/procurement/${id}/edit`}>
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-5 mt-5 font-medium">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Item</p>
                                <p>{procurementDetail?.itemName}</p>
                            </div>  
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">PR Number</p>
                                <p>{procurementDetail?.prNumber}</p>
                            </div>  
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">PO Number</p>
                                <p>{procurementDetail?.poNumber}</p>
                            </div>  
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Product Category</p>
                                <p>{procurementDetail?.itemName}</p>
                            </div>  
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Quantity</p>
                                <p>{procurementDetail?.quantity} unit</p>
                            </div>  
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Submission Date</p>
                                <p>{formatDate(procurementDetail?.submissionDate)}</p>
                            </div>  
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">ETA Target</p>
                                <p>{formatDate(procurementDetail?.etaTarget)}</p>
                            </div>  
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Vendor</p>
                                <p>{procurementDetail?.vendor}</p>
                            </div>  
                        </div>
                    </div>
                </div>
                <div className="flex flex-col self-start gap-y-4">
                    <div className="bg-white w-full rounded-[10px] p-5">
                        <p className="text-sm font-bold">Procurement Progress</p>
                        <div className="mt-4">
                            <p
                                className={`
                                    text-sm font-medium inline-block py-[10px] px-4 rounded-[5px]
                                    ${(procurementDetail?.progress || '') === Progress.PRApproved ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                    ${(procurementDetail?.progress || '') === Progress.POConfirmed? 'text-[#059BFF] bg-[#CDEBFF]' : ''}
                                    ${(procurementDetail?.progress || '') === Progress.Paid? 'text-[#9966FF] bg-[#EBE0FF]' : ''}
                                    ${(procurementDetail?.progress || '') === Progress.Delivered? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                `}
                            >
                                {formatProgressProc(procurementDetail?.progress)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white w-full rounded-[10px] p-5">
                        <p className="text-sm font-bold">Procurement Status</p>
                        <div className="mt-4">
                            <p
                                className={`
                                    text-sm font-medium inline-block py-[10px] px-4 rounded-[5px] 
                                    ${(procurementDetail?.statusProc || '') === StatusProc.Overdue ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                    ${(procurementDetail?.statusProc || '') === StatusProc.OnProgress ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                    ${(procurementDetail?.statusProc || '') === StatusProc.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                `}
                            >
                                {procurementDetail?.statusProc.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}