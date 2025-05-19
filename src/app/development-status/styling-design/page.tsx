"use client"

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredStylingDesign, resetFilteredStylingDesign } from "@/store/slice/stylingDesign/getAllSlice";
import { fetchPartDesignLists } from "@/store/slice/partDesign/getAllSlice";
import { getEffectiveCategory } from "@/utils/filter/effetiveCategory";
import { deletePartDesign, resetDeleteState } from "@/store/slice/partDesign/deleteSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useSnackbar } from "notistack";
import 'swiper/css';
import 'swiper/css/pagination';
import { refetchStylingDesign } from "@/utils/refetch/refetchStylingDesign";

import AddButton from "@/components/common/button/AddButton";
import DropdownCategory from "@/components/common/dropdown/DropdownFilterCategory";
import VisibleButton from "@/components/common/button/VisibleButton";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();
    const { enqueueSnackbar } = useSnackbar();

    /* ------------------- Get All Styling Design ------------------- */

    const { filteredStylingDesigns } = useAppSelector(state => state.stylingDesignLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        dispatch(resetFilteredStylingDesign());
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredStylingDesign({
                    productId: selectedProduct.id
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id]);

    /* ------------------- End Get All Styling Design ------------------- */


    /* ------------------- Get All Part Design ------------------- */

    const [selectedCategory, setSelectedCategory] = useState("Chassis");
    const { partDesigns, loading } = useAppSelector(state => state.partDesignLists);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        if (selectedProduct) {
            dispatch(fetchPartDesignLists({ category: getEffectiveCategory(selectedCategory), productId: selectedProduct.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id, selectedCategory]);

    useEffect(() => {
        setVisibleCount(8);
    }, [selectedCategory, selectedProduct?.id]);

    /* ------------------- End Get All Part Design ------------------- */


    /* ------------------- Delete Part Design ------------------- */
        
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deletePartDesign({ id: targetId }))
                .unwrap()
                .then(() => {
                    if (!selectedProduct?.id) return;
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchStylingDesign(dispatch, selectedProduct.id, getEffectiveCategory(selectedCategory));
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Part Design ------------------- */

    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Part Design"
                message="Are you sure you want to delete this part design?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Development Status Styling Design</p>
                {
                    filteredStylingDesigns.length === 0 && (
                        <div className="flex">
                            <Link href="/development-status/styling-design/add">
                                <AddButton
                                    buttonText="Add Styling Design"
                                />
                            </Link>
                        </div>
                    )
                }
                <div className="flex bg-white p-5 rounded-[10px]">
                    {filteredStylingDesigns.length === 0 ? (
                            <p className="font-bold">Styling Design</p>
                        ) : (
                        filteredStylingDesigns.map((design) => (
                            <div className="flex flex-col gap-10 w-full" key={design.id}>
                                <div className="flex justify-between">
                                    <p className="font-bold">{design.name}</p>
                                    <Link className="cursor-pointer" href={`/development-status/styling-design/${design.id}/edit`}>
                                        <Image className="cursor-pointer" src="/images/icon/edit.svg" alt="Edit Icon" width={22} height={22}/>
                                    </Link>
                                </div>
                                <div className="flex justify-center">
                                    <Swiper
                                        spaceBetween={20}
                                        slidesPerView={1}
                                        pagination={{ clickable: true }}
                                        modules={[Pagination]}
                                        className="w-full max-w-[800px] mx-auto cursor-pointer"
                                    >
                                        {design.StylingDesignImages.map((pct, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="flex justify-center items-center">
                                                    <Image className="w-full h-[350px] object-contain" src={`http://localhost:8080/${pct.picture}`} alt="Styling Design" width={800} height={400}/>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-between">
                    <Link href="/development-status/styling-design/add/part">
                        <AddButton
                            buttonText="Add Part Design"
                        />
                    </Link>
                    <DropdownCategory
                        options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                        onSelect={(value) => setSelectedCategory(value)}
                        defaultValue="Chassis"
                    />
                </div>
                <div className="flex flex-col bg-white p-5 rounded-[10px]">
                    <div className="flex flex-col">
                        <p className="font-bold">{selectedCategory}</p>
                        <div className="mt-5">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                                        {partDesigns.length > 0 ? (
                                            partDesigns.slice(0, visibleCount).map((part) => {
                                                return (
                                                    <div key={part.id} className="relative group cursor-pointer max-w-[245px] max-h-[330px]">
                                                        <Image className="w-[245px] h-[330px] rounded-lg" src={`http://localhost:8080/${part.picture}`} alt="Item Image" width={245} height={330} />
                                                        <div className="absolute left-0 inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 flex flex-col justify-between text-white p-4 transition-opacity duration-300 rounded-lg">
                                                            <div className="flex">
                                                                <p className="text-sm font-medium">{part?.name}</p>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="flex gap-[10px] justify-end">
                                                                    <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                        <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16} />
                                                                    </div>
                                                                    <Link href={`/development-status/styling-design/${part.id}/edit/part`}>
                                                                        <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                            <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16} />
                                                                        </div>
                                                                    </Link>
                                                                    <div 
                                                                        onClick={() => confirmDelete(part.id)}
                                                                        className="p-2 rounded-sm bg-[#D62C35] cursor-pointer"
                                                                    >
                                                                        <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p>No data found.</p>
                                        )}
                                    </div>
                                    {visibleCount < partDesigns.length && (
                                        <VisibleButton
                                            onClick={() => setVisibleCount(prev => prev + 4)}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}