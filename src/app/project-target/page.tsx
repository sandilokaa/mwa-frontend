"use client"

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredProjectTarget, resetFilteredProjectTarget } from "@/store/slice/projectTarget/getAllSlice";

import AddButton from "@/components/common/button/AddButton";
import { projectTargetSections } from "@/utils/filter/projectTargetSection";

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

    return (
        <div>
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Project Target</p>
                <div className="grid grid-cols-2 gap-3">
                    {projectTargetSections.map(section => {
                        const data = filteredProjectTargets.find(item => item.name === section.key);

                        return (
                            <div key={section.key} className="flex flex-col gap-y-2 bg-white p-4 rounded-lg">
                                <p className="font-bold">{section.key}</p>
                                {data ? (
                                    <div className="flex flex-col gap-5">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${data.ProjectTargetImages[0].picture}`}
                                            alt={section.key}
                                            width={600}
                                            height={250}
                                            className="object-contain h-[250px] w-full rounded-lg"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <p>{data.information}</p>
                                            <div className="flex flex-col">
                                                <div className="flex gap-[10px] justify-end">
                                                    <div 
                                                        className="p-2 rounded-sm bg-[#2181E8] cursor-pointer"
                                                    >
                                                        <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16} />
                                                    </div>
                                                    <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                        <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        <Link href={`/project-target/add/${section.url}`}>
                                            <AddButton buttonText={`Add ${section.key}`} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}