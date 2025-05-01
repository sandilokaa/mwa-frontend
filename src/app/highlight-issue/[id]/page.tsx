"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/format/formatDate";
import { fetchIssueDetail, StatusIssue } from "@/store/slice/highlightIssue/getDetailSlice";

export default function DetailData() {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = Number(params.id);

    const { issueDetail } = useAppSelector(state => state.issueDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchIssueDetail({ id }));
        }
    }, [id, dispatch]);

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/highlight-issue">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Highlight Issue Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Highlight Issue Information</p>
                        <Link className="cursor-pointer" href={`/highlight-issue/${id}/edit`}>
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4 mt-5 font-medium">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Item Name</p>
                                <p>{issueDetail?.itemName}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Category</p>
                                <p>{issueDetail?.category}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">PIC (C/M)</p>
                                <p>{issueDetail?.pic}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Issue</p>
                                <p>{issueDetail?.issue}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Countermeassure (C/M)</p>
                                <p>{issueDetail?.countermeassure}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Due Date</p>
                                <p>{formatDate(issueDetail?.dueDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full rounded-[10px] p-5 self-start">
                    <p className="text-sm font-bold">Highligth Issue Status</p>
                    <div className="mt-4">
                        <p
                            className={`
                                text-sm font-medium inline-block py-[10px] px-4 rounded-[5px] 
                                ${(issueDetail?.statusIssue || '') === StatusIssue.Late ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                ${(issueDetail?.statusIssue || '') === StatusIssue.OnProgress ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                ${(issueDetail?.statusIssue || '') === StatusIssue.Finish ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                            `}
                        >
                            {issueDetail?.statusIssue.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}