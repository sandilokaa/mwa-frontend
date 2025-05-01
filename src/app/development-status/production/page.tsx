"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredProduction, ProductionStatus } from "@/store/slice/production/getAllSlice";
import { deleteProduction, resetDeleteState } from "@/store/slice/production/deleteSlice";
import { refetchProductions } from "@/utils/refetch/refetchProduction";
import { useSnackbar } from "notistack";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import TablePagination from "@/components/common/pagination/TablePagination";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();
    const { enqueueSnackbar } = useSnackbar();

    /* ------------------- Get All Production ------------------- */
    
    const [search, setSearch] = useState('');
    const { filteredProductions: { productionDataFiltered, currentPagesProd, totalPagesProd }, loading } = useAppSelector(state => state.productionLists);

    console.log(productionDataFiltered)

    useEffect(() => {
        if (!selectedProduct?.id) return;
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredProduction({
                    productId: selectedProduct.id,
                    partNumber: search,
                    page: 1
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedProduct?.id]);

    // const chartData = getProcurementChartData(summaryProcurements);

    const handlePageProdChange = (newPage: number) => {
        if (!selectedProduct?.id) return;
        dispatch(fetchFilteredProduction({
            productId: selectedProduct.id,
            partNumber: search,
            page: newPage
        }));
    };

    /* ------------------- End Get All Production ------------------- */


    /* ------------------- Delete Production ------------------- */
    
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteProduction({ id: targetId }))
                .unwrap()
                .then(() => {
                    if (!selectedProduct?.id) return;
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchProductions(dispatch, selectedProduct.id, search);
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Production ------------------- */

    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Production"
                message="Are you sure you want to delete this production?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Development Status Production</p>
                <div className="flex justify-between">
                    <Link href="/development-status/production/add">
                        <AddButton
                            buttonText="Add Production"
                        />
                    </Link>
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-5">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col justify-between w-3/4 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Cumulative Production Performance</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-full bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Production Status Overview</h2>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="overflow-x-auto rounded-lg bg-white p-[10px]">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-[#F5F5F5]">
                            <tr className="text-sm font-bold text-center">
                                <th className="py-5 px-4 text-left">No</th>
                                <th className="py-5 px-4 text-left min-w-[200px]">Part Name</th>
                                <th className="py-5 px-4 min-w-[170px]">Drawing Number</th>
                                <th className="py-5 px-4 min-w-[170px]">Part Number</th>
                                <th className="py-5 px-4 min-w-[170px]">Information</th>
                                <th className="py-5 px-4 min-w-[150px]">Status</th>
                                <th className="py-5 px-4 min-w-[150px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-5 text-center text-sm font-medium">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {productionDataFiltered.length > 0 ? (
                                        productionDataFiltered.map((prod, index) => {
                                            const colStyle = {
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                                            };

                                            const limit = 5;

                                            const displayIndex = ((currentPagesProd - 1) * limit + index + 1).toString().padStart(2, '0');

                                            return (
                                                <tr className="text-sm font-medium text-center" key={prod.id} style={colStyle}>
                                                    <td className="py-5 px-4 text-left">{displayIndex}</td>
                                                    <td className="py-5 px-4 text-left">{prod.partName}</td>
                                                    <td className="py-5 px-4">{prod.drawingNumber}</td>
                                                    <td className="py-5 px-4 ">{prod.partNumber}</td>
                                                    <td className="py-5 px-4 text-left">
                                                        <div className="flex line-clamp-3">
                                                            {prod.information}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                        p-2 rounded-[5px] flex justify-center w-full
                                                                        ${prod.productionStatus === ProductionStatus.OnProgress ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                                                        ${prod.productionStatus === ProductionStatus.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                `}
                                                            >
                                                                <p>{prod.productionStatus.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                            </div>
                                                            <div
                                                                // onClick={() => {
                                                                //     setShowProgressMenuId(prevId => {
                                                                //         const newId = prevId === proc.id ? null : proc.id;
                                                                //         if (newId !== null) {
                                                                //             setSelectedProgress(proc.progress);
                                                                //         }
                                                                //         return newId;
                                                                //     });
                                                                // }}
                                                                className="flex justify-center items-center cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/menu.svg" alt="Menu Icon" width={15} height={15}/>
                                                            </div>
                                                        </div>
                                                        {/* {showProgressMenuId === proc.id && (
                                                            <ProgressProcMenu
                                                                selectedProgress={selectedProgress}
                                                                onToggle={toggleProgress}
                                                                onSave={() => handleUpdateProgress(proc.id)}
                                                                onClose={() => setShowProgressMenuId(null)}
                                                            />
                                                        )} */}
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex gap-[10px] justify-center">
                                                            <Link href={`/development-status/production/${prod.id}`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                    <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <Link href={`/development-status/production/${prod.id}/edit`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                    <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <div 
                                                                onClick={() => confirmDelete(prod.id)}
                                                                className="p-2 rounded-sm bg-[#D62C35] cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )
                                    ): (
                                        <tr>
                                            <td colSpan={8} className="py-5 text-center text-sm font-medium">
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                    <TablePagination
                        currentPage={currentPagesProd}
                        totalPages={totalPagesProd}
                        onPageChange={handlePageProdChange}
                    />
                </div>
            </div>
        </div>
    );
}