"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchPhotoUpdateLists } from "@/store/slice/photoUpdate/getAllSlice";
import { useProductFilter } from "@/context/ProductFilterContext";
import { deletePhotoUpdate, resetDeleteState } from "@/store/slice/photoUpdate/deleteSlice";
import { useSnackbar } from "notistack";
import { refetchPhotoUpdates } from "@/utils/refetchPhotoUpdate";

import AddButton from "@/components/common/button/AddButton";
import DropdownCategory from "@/components/common/dropdown/DropdownFilterCategory";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";

export default function ShowData() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [selectedCategory, setSelectedCategory] = useState("Chassis");
    const { selectedProduct } = useProductFilter();
    const { photoUpdates, loading } = useAppSelector(state => state.photoUpdateLists);


    /* ------------------- Get All Photo Update ------------------- */

    useEffect(() => {
        if (selectedProduct) {
            dispatch(fetchPhotoUpdateLists({ category: selectedCategory, productId: selectedProduct.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id, selectedCategory]);

    /* ------------------- End Get All Photo Update ------------------- */


    /* ------------------- Delete Photo Update ------------------- */

    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    console.log(targetId);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deletePhotoUpdate({ id: targetId }))
                .unwrap()
                .then(() => {
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchPhotoUpdates(dispatch, selectedProduct?.id, selectedCategory);
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Photo Update ------------------- */

    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Photo"
                message="Are you sure you want to delete this Photo?"
                confirmText="Delete"
                cancelText="Cancel"
            />
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
                                        <div key={photo.id} className="relative group cursor-pointer max-w-[275px] max-h-[370px]">
                                            <Image className="w-[275px] h-[370px] rounded-lg" src={`http://localhost:8080/${photo.picture}`} alt="Item Image" width={275} height={370} />
                                            <div className="absolute left-0 inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 flex flex-col justify-end text-white p-4 transition-opacity duration-300 rounded-lg">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-sm font-medium">{new Date(photo?.dateInput).toLocaleDateString('en-GB')}</p>
                                                        <p className="text-sm font-medium mt-1">{photo?.information}</p>
                                                    </div>
                                                    <div className="flex gap-[10px] justify-end">
                                                        <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                            <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16} />
                                                        </div>
                                                        <Link href={`/photo-update/${photo.id}/edit`}>
                                                            <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16} />
                                                            </div>
                                                        </Link>
                                                        <div 
                                                            onClick={() => confirmDelete(photo.id)}
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
                    )}
                </div>
            </div>
        </div>
    );
}