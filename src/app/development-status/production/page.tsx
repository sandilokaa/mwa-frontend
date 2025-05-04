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
import { updateProductionStatusData, resetUpdatedStatusProduction } from "@/store/slice/production/statusUpdateSlice";
import { getProductionChartData } from "@/utils/chart/productionChart";
import { getEffectiveCategory } from "@/utils/filter/effetiveCategory";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import TablePagination from "@/components/common/pagination/TablePagination";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";
import StatusMenu from "@/components/common/modal/StatusMenu";
import { StatusProductionOptions } from "@/utils/status/statusOption";
import DropdownCategory from "@/components/common/dropdown/DropdownFilterCategory";
import DoughnutChart from "@/components/common/chart/DoughnutChart";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();
    const { enqueueSnackbar } = useSnackbar();

    
    /* ------------------- Get All Production ------------------- */
    
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("Overall");
    const { filteredProductions: { productionDataFiltered, currentPagesProd, totalPagesProd }, loading, summaryProductionStatus } = useAppSelector(state => state.productionLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        const delay = setTimeout(() => {
            if (selectedProduct) {
                refetchProductions(dispatch, selectedProduct.id, search, getEffectiveCategory(selectedCategory));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedCategory, selectedProduct?.id]);

    const chartData = getProductionChartData(summaryProductionStatus);

    const handlePageProdChange = (newPage: number) => {
        if (!selectedProduct?.id) return;
        dispatch(fetchFilteredProduction({
            productId: selectedProduct.id,
            partName: search,
            page: newPage,
            category: selectedCategory
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
                    refetchProductions(dispatch, selectedProduct.id, search, getEffectiveCategory(selectedCategory));
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Production ------------------- */


    /* ------------------- Modal Status Produciton ------------------- */
    
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [showStatusMenuId, setShowStatusMenuId] = useState<number | null>(null);

    const toggleStatus = (value: string) => {
        setSelectedStatus(value)
    };

    const handleUpdateStatus = (id: number) => {
        if (!selectedProduct?.id || !selectedStatus) return; 
    
        dispatch(updateProductionStatusData({ id, productionStatus: selectedStatus.toLowerCase() }))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Progress updated successfully", { variant: "success" });
                dispatch(resetUpdatedStatusProduction());
                refetchProductions(dispatch, selectedProduct.id, search, getEffectiveCategory(selectedCategory));
            })
            .catch(() => {
                enqueueSnackbar("Failed to update progress", { variant: "error" });
                dispatch(resetUpdatedStatusProduction());
            });
    
            setShowStatusMenuId(null);
    }

    /* ------------------- End Modal Status Produciton ------------------- */

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
                    <div className="flex gap-4">
                        <DropdownCategory
                            options={["Overall", "Chassis", "Under Body", "Upper Body"]}
                            onSelect={(value) => setSelectedCategory(value)}
                        />
                        <SearchInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col justify-between w-3/4 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Cumulative Production Performance</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-full bg-white p-5 rounded-[10px] gap-5">
                        <h2 className="font-bold text-sm">Production Status Overview</h2>
                        <div className="flex justify-center">
                            <DoughnutChart
                                title="Status Overview"
                                data={chartData}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="rounded-lg bg-white p-[10px]">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-[#F5F5F5]">
                            <tr className="text-sm font-bold text-center">
                                <th className="py-5 px-4 text-left">No</th>
                                <th className="py-5 px-4 text-left min-w-[200px]">Part Name</th>
                                <th className="py-5 px-4 min-w-[170px]">Drawing Number</th>
                                <th className="py-5 px-4 min-w-[170px]">Category</th>
                                <th className="py-5 px-4 min-w-[170px]">Remarks</th>
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
                                                    <td className="py-5 px-4 ">{prod.category}</td>
                                                    <td className="py-5 px-4 text-left">
                                                        <div className="flex line-clamp-3">
                                                            {prod.remark}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                        p-2 rounded-[5px] flex justify-center w-full
                                                                        ${prod.productionStatus === ProductionStatus.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                                                        ${prod.productionStatus === ProductionStatus.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                        ${prod.productionStatus === ProductionStatus.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                `}
                                                            >
                                                                <p>{prod.productionStatus.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                            </div>
                                                            <div
                                                                onClick={() => {
                                                                    setShowStatusMenuId(prevId => {
                                                                        const newId = prevId === prod.id ? null : prod.id;
                                                                        if (newId !== null) {
                                                                            setSelectedStatus(prod.productionStatus);
                                                                        }
                                                                        return newId;
                                                                    });
                                                                }}
                                                                className="flex justify-center items-center cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/menu.svg" alt="Menu Icon" width={15} height={15}/>
                                                            </div>
                                                        </div>
                                                        {showStatusMenuId === prod.id && (
                                                            <StatusMenu
                                                                selectedStatus={selectedStatus}
                                                                onToggle={toggleStatus}
                                                                onSave={() => handleUpdateStatus(prod.id)}
                                                                onClose={() => setShowStatusMenuId(null)}
                                                                statusOptions={StatusProductionOptions}
                                                            />
                                                        )}
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