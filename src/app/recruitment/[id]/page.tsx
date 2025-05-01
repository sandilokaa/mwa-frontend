"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRecruitmentDetail, Progress, StatusRec } from "@/store/slice/recruitment/getDetailSlice";
import { formatProgressRec } from "@/utils/format/formatProgress";
import { formatDate } from "@/utils/format/formatDate";

export default function DetailData() {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = Number(params.id);

    const { recruitmentDetail } = useAppSelector(state => state.recruitmentDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchRecruitmentDetail({ id }));
        }
    }, [id, dispatch]);

    return (
        <div>
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/recruitment">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Recruitment Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Recruitment Information</p>
                        <Link className="cursor-pointer" href={`/recruitment/${id}/edit`}>
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-5 mt-5 font-medium">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Name</p>
                                <p>{recruitmentDetail?.name}</p>
                            </div>  
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Submission Date</p>
                                <p>{formatDate(recruitmentDetail?.submissionDate)}</p>
                            </div>  
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Join Date</p>
                                <p>{formatDate(recruitmentDetail?.joinDate)}</p>
                            </div>  
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Position</p>
                                <p>{recruitmentDetail?.position}</p>
                            </div>  
                            <div className="flex flex-col gap-2">
                                <p className="text-[#989898] text-sm">Division</p>
                                <p>{recruitmentDetail?.division}</p>
                            </div>  
                        </div>
                    </div>
                </div>
                <div className="flex flex-col self-start gap-y-4">
                    <div className="bg-white w-full rounded-[10px] p-5">
                        <p className="text-sm font-bold">Recruitment Progress</p>
                        <div className="mt-4">
                            <p
                                className={`
                                    text-sm font-medium inline-block py-[10px] px-4 rounded-[5px]
                                    ${(recruitmentDetail?.progress || '') === Progress.InterviewHR ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                    ${(recruitmentDetail?.progress || '') === Progress.InterviewUser? 'text-[#059BFF] bg-[#CDEBFF]' : ''}
                                    ${(recruitmentDetail?.progress || '') === Progress.InterviewComben? 'text-[#9966FF] bg-[#EBE0FF]' : ''}
                                    ${(recruitmentDetail?.progress || '') === Progress.OfferLetter? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                `}
                            >
                                {formatProgressRec(recruitmentDetail?.progress)}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white w-full rounded-[10px] p-5">
                        <p className="text-sm font-bold">Recruitment Status</p>
                        <div className="mt-4">
                            <p
                                className={`
                                    text-sm font-medium inline-block py-[10px] px-4 rounded-[5px] 
                                    ${(recruitmentDetail?.statusRec || '') === StatusRec.Overdue ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                    ${(recruitmentDetail?.statusRec || '') === StatusRec.OnProgress ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                    ${(recruitmentDetail?.statusRec || '') === StatusRec.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                `}
                            >
                                {recruitmentDetail?.statusRec.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}