'use client'

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { extractFilename } from "@/utils/format/formatFilename";

interface SwiperModalProps {
    open: boolean;
    onClose: () => void;
    images: string[];
}

const SwiperPhotoModal: React.FC<SwiperModalProps> = ({
    open,
    onClose,
    images
}) => {

    const [activeIndex, setActiveIndex] = useState(0);

    if (!open) return null;

    const activeImage = images.length > 0 ? images[activeIndex] : '';
    const activeFilename = extractFilename(activeImage);
    const downloadUrl = activeFilename
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/download/${activeFilename}`
        : '';

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="flex flex-col gap-4 bg-white px-6 py-4 rounded shadow-md">
                <div
                    className="flex justify-between items-center py-2"
                >
                    <div className="flex">
                        <p className="font-bold">Supporting Documents</p>
                    </div>
                    <div onClick={onClose} className="p-1 border border-[#F5F6F8] rounded-sm">
                        <Image className="cursor-pointer h-[16px] w-[16px]" src="/images/icon/close.svg" alt="close icon" height={20} width={20}/>
                    </div>
                </div>
                <div className="w-[900px] h-[480px] relative cursor-pointer">
                    <Swiper
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        className="h-full"
                    >
                        {images.map((imgUrl, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="w-[900px] h-[450px] flex items-center justify-center">
                                    {imgUrl ? (
                                        <Image
                                        src={imgUrl}
                                        alt={`Slide ${idx + 1}`}
                                        width={900}
                                        height={450}
                                        className="object-contain h-[450px] w-[900px]"
                                        />
                                    ) : (
                                        <div className="text-red-500">Image not available</div>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className="flex gap-2 font-medium justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-transparent border border-[#F5F6F8] rounded cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-sm bg-[#144C68] rounded cursor-pointer text-white"
                    >
                        <a className="text-sm font-medium text-white" download href={downloadUrl}>Download</a>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwiperPhotoModal;