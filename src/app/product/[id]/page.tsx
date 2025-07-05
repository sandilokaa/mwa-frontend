"use client"

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductDetail } from "@/store/slice/product/getDetailSlice";

import LargePhotoModal from "@/components/common/modal/LargePhotoModal";

export default function DetailData() {

    const dispatch = useAppDispatch();
    const params = useParams();
    const id = Number(params.id);

    const { productDetail } = useAppSelector(state => state.productDetail);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetail({ id }));
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
                imgUrl={`${process.env.NEXT_PUBLIC_API_URL}/${productDetail?.picture}`}
                downloadUrl={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/download/${productDetail?.picture}`}
            />
            <div className="flex gap-2">   
                <Link className="cursor-pointer" href="/product">
                    <Image src="/images/icon/chevron-down.svg" width={24} height={24} alt="Back Icon"/>
                </Link>
                <p className="font-bold">Product Detail</p>
            </div>
            <div className="grid grid-cols-1 mt-5 gap-5">
                <div className="bg-white w-full rounded-[10px] p-5 col-span-3">
                    <div className="flex justify-between">
                        <p className="text-sm font-bold">Product Information</p>
                        <Link className="cursor-pointer" href={`/product/${id}/edit`}>
                            <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4 mt-5 font-medium">
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Product Name</p>
                                <p>{productDetail?.name}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Tagline</p>
                                <p>{productDetail?.tagline}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Description</p>
                                <p>{productDetail?.description}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-[#989898]">Supporting Documents</p>
                                {productDetail?.picture && (
                                    <div className="flex flex-col gap-4">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${productDetail.picture}`}
                                            alt="Supporting Documents"
                                            width={400}
                                            height={200}
                                            className="rounded-lg"
                                        />
                                        <div className="flex gap-2">
                                            <div 
                                                onClick={() => largePhotoModal()}
                                                className="px-4 py-2 bg-[#144C68] rounded-md cursor-pointer flex items-center"
                                            >
                                                <p className="text-sm font-medium text-white">View Large</p>
                                            </div>
                                            <div className="px-4 py-2 bg-[#144C68] rounded-md flex items-center">
                                                <a className="text-sm font-medium text-white" download href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/download/${productDetail.picture}`}>Download</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}