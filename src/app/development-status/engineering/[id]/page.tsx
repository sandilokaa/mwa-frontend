"use client"

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchEngineeringDetail, Status2D, Status3D, StatusDXF } from "@/store/slice/engineering/getDetailSlice";
import { formatDate } from "@/utils/format/formatDate";
import CurrencyFormatter from "@/utils/format/formatCurrency";

import LargePhotoModal from "@/components/common/modal/LargePhotoModal";
import CanAccess from "@/components/access/CanAccess";

export default function DetailData() {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = Number(params.id);

    const { engineeringDetail } = useAppSelector(state => state.engineeringDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchEngineeringDetail({ id }));
        }
    }, [id, dispatch]);

    /* ---------------- LARGE PHOTO MODAL ---------------- */

    const [openModal, setOpenModal] = useState(false);


    const largePhotoModal = () => {
        setOpenModal(true);
    };

    /* ---------------- END LARGE PHOTO MODAL ---------------- */

    return (
        <div>
            <LargePhotoModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                imgUrl={`${process.env.NEXT_PUBLIC_API_URL}/${engineeringDetail?.picture}`}
                downloadUrl={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/download/${engineeringDetail?.picture}`}
            />
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/development-status/engineering/">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Design Engineeering Detail</p>
            </div>
            <div className="grid grid-cols-4 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Design Engineeering Information</p>
                        <CanAccess roles={['RnE']}>
                            <Link className="cursor-pointer" href={`/development-status/engineering/${id}/edit`}>
                                <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                            </Link>
                        </CanAccess>
                    </div>
                    <div className="flex flex-col gap-4 mt-5 font-medium">
                        <div className="grid grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Part Name</p>
                                <p>{engineeringDetail?.partName}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Drawing Number</p>
                                <p>{engineeringDetail?.drawingNumber}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Category</p>
                                <p>{engineeringDetail?.category}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">PIC 3D</p>
                                <p>{engineeringDetail?.pic3D}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">PIC 2D & DXF</p>
                                <p>{engineeringDetail?.pic2DDXF}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Start Date</p>
                                <p>{formatDate(engineeringDetail?.startDate)}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Date Required</p>
                                <p>{formatDate(engineeringDetail?.dateRequired)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Price</p>
                                <p>{CurrencyFormatter(engineeringDetail?.price)}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Quantity</p>
                                <p>{engineeringDetail?.quantity}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Total Price</p>
                                <p>{CurrencyFormatter(engineeringDetail?.totalPrice)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Remark</p>
                                <p>{engineeringDetail?.remark}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Supporting Documents</p>
                                {engineeringDetail?.picture && (
                                    <div className="flex flex-col gap-4">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${engineeringDetail.picture}`}
                                            alt="Supporting Documents"
                                            className="rounded-lg"
                                            width={400}
                                            height={200}
                                        />
                                        <div className="flex gap-2">
                                            <div 
                                                onClick={() => largePhotoModal()}
                                                className="px-4 py-2 bg-[#144C68] rounded-md cursor-pointer flex items-center"
                                            >
                                                <p className="text-sm font-medium text-white">View Large</p>
                                            </div>
                                            <div className="px-4 py-2 bg-[#144C68] rounded-md flex items-center">
                                                <a className="text-sm font-medium text-white" download href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/download/${engineeringDetail.picture}`}>Download</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="bg-white w-full rounded-[10px] p-5 self-start">
                        <p className="text-sm font-bold">3D Status</p>
                        <div className="mt-4">
                            <p
                                className={`
                                    text-sm font-medium inline-block py-[10px] px-4 rounded-[5px]
                                    ${engineeringDetail?.status3D === Status3D.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                    ${engineeringDetail?.status3D === Status3D.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                    ${engineeringDetail?.status3D === Status3D.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                `}
                            >
                                {engineeringDetail?.status3D.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white w-full rounded-[10px] p-5 self-start">
                        <p className="text-sm font-bold">2D Status</p>
                        <div className="mt-4">
                            <p
                                className={`
                                    text-sm font-medium inline-block py-[10px] px-4 rounded-[5px]
                                    ${engineeringDetail?.status2D === Status2D.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                    ${engineeringDetail?.status2D === Status2D.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                    ${engineeringDetail?.status2D === Status2D.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                `}
                            >
                                {engineeringDetail?.status2D.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white w-full rounded-[10px] p-5 self-start">
                        <p className="text-sm font-bold">DXF Status</p>
                        <div className="mt-4">
                            <p
                                className={`
                                    text-sm font-medium inline-block py-[10px] px-4 rounded-[5px]
                                    ${engineeringDetail?.statusDXF === StatusDXF.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                    ${engineeringDetail?.statusDXF === StatusDXF.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                    ${engineeringDetail?.statusDXF === StatusDXF.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                `}
                            >
                                {engineeringDetail?.statusDXF.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}