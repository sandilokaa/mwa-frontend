"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slice/product/getAllSlice";
import { deleteProduct, resetDeleteState } from "@/store/slice/product/deleteSlice";
import { useSnackbar } from "notistack";

import AddButton from "@/components/common/button/AddButton";
import VisibleButton from "@/components/common/button/VisibleButton";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";
import CanAccess from "@/components/access/CanAccess";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { products, loading } = useAppSelector(state => state.productList);
    
    const [visibleCount, setVisibleCount] = useState(4);


    /* ------------------- Get All Product ------------------- */

    useEffect(() => {
        dispatch(fetchProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setVisibleCount(8);
    }, []);

    /* ------------------- End Get All Product ------------------- */


    /* ------------------- Delete Product ------------------- */
    
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteProduct({ id: targetId }))
                .unwrap()
                .then(() => {
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    dispatch(fetchProducts());
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Product ------------------- */

    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-5">
                <p className="font-bold">Product</p>
                <div className="flex justify-between">
                    <CanAccess roles={['RnE']}>
                        <Link href="/product/add">
                            <AddButton
                                buttonText="Add Product"
                            />
                        </Link>
                    </CanAccess>
                </div>
                <div className="mt-5 bg-white p-5 rounded-lg">
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                                    {products.length > 0 ? (
                                        products.slice(0, visibleCount).map((product) => {
                                            return (
                                                <div key={product.id} className="relative group cursor-pointer max-w-[364px] max-h-[220px] border border-gray-200 rounded-lg">
                                                    <Image className="w-[364px] h-[220px] rounded-lg" src={`${process.env.NEXT_PUBLIC_API_URL}/${product.picture}`} alt="Item Image" width={370} height={220} />
                                                    <div className="absolute left-0 inset-0 bg-[rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 flex flex-col justify-end text-white p-4 transition-opacity duration-300 rounded-lg w-full h-[220px]">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-col gap-1">
                                                                <p className="font-bold">{product.name.toUpperCase()}</p>
                                                                <p className="text-sm font-medium">{product.tagline}</p>
                                                            </div>
                                                            <div className="flex gap-[10px] justify-end">
                                                                <Link href={`/product/${product.id}`} prefetch>
                                                                    <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                        <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                                                    </div>
                                                                </Link>
                                                                <CanAccess roles={['RnE']}>
                                                                    <Link href={`/product/${product.id}/edit`} prefetch>
                                                                        <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                            <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16} />
                                                                        </div>
                                                                    </Link>
                                                                    <div 
                                                                        onClick={() => confirmDelete(product.id)}
                                                                        className="p-2 rounded-sm bg-[#D62C35] cursor-pointer"
                                                                    >
                                                                        <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16} />
                                                                    </div>
                                                                </CanAccess>
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
                                {visibleCount < products.length && (
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
    );
}
