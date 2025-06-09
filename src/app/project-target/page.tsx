"use client"

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredProjectTarget, resetFilteredProjectTarget } from "@/store/slice/projectTarget/getAllSlice";
import { projectTargetSections } from "@/utils/filter/projectTargetSection";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import AddButton from "@/components/common/button/AddButton";
import SwiperPhotoModal from "@/components/common/modal/SwiperPhotoModal";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();

    /* ------------------- Get All Project Target ------------------- */
    
    const { filteredProjectTargets } = useAppSelector(state => state.projectTargetLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        dispatch(resetFilteredProjectTarget());
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredProjectTarget({
                    productId: selectedProduct.id
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id]);

    /* ------------------- End Get All Project Target ------------------- */


    /* ------------------- Expanded Information ------------------- */
    
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
    
    const toggleExpand = (id: number) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    
    /* ------------------- End Expanded Information ------------------- */


    /* ---------------- Large Photo Modal ---------------- */

    const [openModal, setOpenModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string[]>([]);

    const largePhotoModal = () => {
        setOpenModal(true);
    };

    /* ---------------- END Large Photo Modal ---------------- */

    return (
        <div>
            <SwiperPhotoModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                images={selectedPhoto?.map(path => `${process.env.NEXT_PUBLIC_API_URL}/${path}`) ?? []}
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Project Target</p>
                <div className="grid grid-cols-1">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={2}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        className="h-full w-full"
                    >
                        {projectTargetSections.map(section => {
                            const data = filteredProjectTargets.find(item => item.name === section.key);

                            return (
                                <SwiperSlide key={section.key}>
                                    <div className="w-full h-full min-h-[500px] flex flex-col gap-y-2 bg-white p-4 rounded-lg cursor-pointer">
                                        <p className="font-bold">{section.key}</p>
                                        {data ? (
                                            <div className="flex flex-col gap-5">
                                                {data?.ProjectTargetImages?.[0]?.picture && (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${data.ProjectTargetImages[0].picture}`}
                                                        alt={section.key}
                                                        width={600}
                                                        height={250}
                                                        className="object-contain h-[300px] w-full rounded-lg"
                                                        priority
                                                    />
                                                )}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-1">
                                                        <p className={`transition-all ${!expandedIds[data.id] ? "line-clamp-2" : ""}`}>
                                                            {data.information}
                                                        </p>
                                                        <button
                                                            onClick={() => toggleExpand(data.id)}
                                                            className="text-xs text-blue-500 hover:underline self-start cursor-pointer"
                                                        >
                                                            {expandedIds[data.id] ? "Show less" : "Show more"}
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex gap-[10px] justify-end">
                                                            <div 
                                                                onClick={() => {
                                                                    const imageUrls = data.ProjectTargetImages.map((item) => item.picture)
                                                                    setSelectedPhoto(imageUrls);
                                                                    largePhotoModal()
                                                                }}
                                                                className="p-2 rounded-sm bg-[#2181E8] cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16} />
                                                            </div>
                                                            <Link href={`/project-target/${data.id}/edit/${section.url}`}>
                                                                <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                    <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16} />
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 justify-center items-center">
                                                <Link href={`/project-target/add/${section.url}`}>
                                                    <AddButton buttonText={`Add ${section.key}`} />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}