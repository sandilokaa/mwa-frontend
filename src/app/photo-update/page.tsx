"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchPhotoUpdateLists } from "@/store/slice/photoUpdate/getAllSlice";
import { useProductFilter } from "@/context/ProductFilterContext";

import AddButton from "@/components/common/button/AddButton";
import DropdownCategory from "@/components/common/dropdown/DropdownFilterCategory";

export default function ShowData() {
    const dispatch = useAppDispatch();
    const [selectedCategory, setSelectedCategory] = useState("Chassis");
    const { selectedProduct } = useProductFilter();
    const { photoUpdates, loading } = useAppSelector(state => state.photoUpdateLists);

    useEffect(() => {
        if (selectedProduct) {
            dispatch(fetchPhotoUpdateLists({ category: selectedCategory, productId: selectedProduct.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id, selectedCategory]);

    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Photo Update</p>
                <div className="flex justify-between">
                    <Link href="/photo-update/add">
                        <AddButton
                            buttonText="Add Photo Update"
                        />
                    </Link>
                    <div className="flex gap-5">
                        <DropdownCategory
                            options={["Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                            onSelect={(value) => setSelectedCategory(value)}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <div className="grid grid-cols-1">
                    <p className="font-bold">{selectedCategory}</p>
                </div>
                <div className="mt-5">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            {photoUpdates.length > 0 ? (
                                photoUpdates.map((photo) => {
                                    return (
                                        <div key={photo.id} className="relative group cursor-pointer min-w-[275px] min-h-[330px]">
                                            <Image className="w-full h-auto rounded-lg" src={`http://localhost:8080/${photo.picture}`} alt="Item Image" width={275} height={330} />
                                            <div className="absolute left-0 inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 flex flex-col justify-end text-white p-4 transition-opacity duration-300 rounded-lg">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm font-medium">{new Date(photo?.dateInput).toLocaleDateString('en-GB')}</p>
                                                        <p className="text-sm font-medium mt-1">{photo?.information}</p>
                                                    </div>
                                                    <div className="flex gap-[10px] justify-end">
                                                        <Link href={`/photo-update/${photo.id}`}>
                                                            <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16} />
                                                            </div>
                                                        </Link>
                                                        <Link href={`/photo-update/${photo.id}/edit`}>
                                                            <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16} />
                                                            </div>
                                                        </Link>
                                                        <div className="p-2 rounded-sm bg-[#D62C35] cursor-pointer">
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
                    )}
                </div>
            </div>
        </div>
    );
}