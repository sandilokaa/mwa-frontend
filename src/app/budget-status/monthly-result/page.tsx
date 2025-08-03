"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredBudgetLimit } from "@/store/slice/budgetStatus/limit/getAllSlice";
import { useSnackbar } from "notistack";
import { deleteBudgetLimit, resetDeleteState } from "@/store/slice/budgetStatus/limit/deleteSlice";
import { refetchBudgetLimit } from "@/utils/refetch/refetchBudgetLimit";
import { monthNames } from "@/utils/date/month";

import TablePagination from "@/components/common/pagination/TablePagination";
import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import CanAccess from "@/components/access/CanAccess";
import CurrencyFormatter from "@/utils/format/formatCurrency";
import DropdownMonth from "@/components/common/dropdown/DropdownMonth";
import DropdownYear from "@/components/common/dropdown/DropdownYear";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();
    const { enqueueSnackbar } = useSnackbar();

    /* ------------------- Get All Budget Status ------------------- */
    
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(monthNames[today.getMonth()]);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear().toString());
    const [search, setSearch] = useState('');
    const { filteredBudgetLimit: { budgetLimitDataFiltered, currentPagesBudgetLimit, totalPagesBudgetLimit }, loading } = useAppSelector(state => state.budgetLimitList);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredBudgetLimit({
                    productId: selectedProduct.id,
                    system: search,
                    page: 1,
                    month: selectedMonth,
                    year: selectedYear
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedProduct?.id, selectedMonth, selectedYear]);

    const handlePageBudgetLimitChange = (newPage: number) => {
        if (!selectedProduct?.id) return;
        dispatch(fetchFilteredBudgetLimit({
            productId: selectedProduct.id,
            system: search,
            page: newPage,
            month: selectedMonth,
            year: selectedYear
        }));
    };

    /* ------------------- End Get All Budget Status ------------------- */


    /* ------------------- Delete Budget Limit ------------------- */
        
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteBudgetLimit({ id: targetId }))
                .unwrap()
                .then(() => {
                    if (!selectedProduct?.id) return;
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchBudgetLimit(dispatch, selectedProduct.id, search, selectedMonth, selectedYear);
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Budget Limit ------------------- */

    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Budget Limit"
                message="Are you sure you want to delete this budget limit?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Budget Status Monthly</p>
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <CanAccess roles={["RnE"]}>
                            <Link href="/budget-status/monthly-result/add">
                                <AddButton
                                    buttonText="Add Budget Limit"
                                />
                            </Link>
                        </CanAccess>
                    </div>
                    <div className="flex gap-2">
                        <DropdownMonth
                            value={selectedMonth}
                            onSelect={(value) => setSelectedMonth(value)}
                        />
                        <DropdownYear
                            value={selectedYear}
                            onSelect={(value) => setSelectedYear(value)}
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
                        <h2 className="font-bold text-sm">Budget Status Monthly Chart</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-1/4 h-full">
                        <div className="bg-white p-5 rounded-[10px] flex flex-col">
                            <h3 className="text-sm font-bold">Earning Report</h3>
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
                                <th className="py-5 px-4 text-left min-w-[200px]">System</th>
                                <th className="py-5 px-4 min-w-[190px]">Limit</th>
                                <th className="py-5 px-4 min-w-[100px]">Month</th>
                                <th className="py-5 px-4 min-w-[100px]">Year</th>
                                <th className="py-5 px-4 min-w-[140px]">Action</th>
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
                                    {budgetLimitDataFiltered.length > 0 ? (
                                        budgetLimitDataFiltered.map((budget, index) => {
                                            const colStyle = {
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                                            };

                                            const limit = 5;

                                            const displayIndex = ((currentPagesBudgetLimit - 1) * limit + index + 1).toString().padStart(2, '0');

                                            return (
                                                <tr className="text-sm font-medium text-center" key={budget.id} style={colStyle}>
                                                    <td className="py-5 px-4 text-left">{displayIndex}</td>
                                                    <td className="py-5 px-4 text-left">{budget.system}</td>
                                                    <td className="py-5 px-4 text-center">{CurrencyFormatter(budget.limit)}</td>
                                                    <td className="py-5 px-4 text-center">{budget.month}</td>
                                                    <td className="py-5 px-4 text-center">{budget.year}</td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex gap-[10px] justify-center">
                                                            <Link href={`/budget-status/monthly-result/${budget.id}`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                    <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <CanAccess roles={['RnE']}>
                                                                <Link href={`/budget-status/monthly-result/${budget.id}/edit`} prefetch>
                                                                    <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                        <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                                                    </div>
                                                                </Link>
                                                                <div 
                                                                    onClick={() => confirmDelete(budget.id)}
                                                                    className="p-2 rounded-sm bg-[#D62C35] cursor-pointer"
                                                                >
                                                                    <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </CanAccess>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
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
                        currentPage={currentPagesBudgetLimit}
                        totalPages={totalPagesBudgetLimit}
                        onPageChange={handlePageBudgetLimitChange}
                    />
                </div>
            </div>
        </div>
    );
}