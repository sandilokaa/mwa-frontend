"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredProcurement, Progress, StatusProc, fetchAllProcurements, fetchSummaryProcurement } from "@/store/slice/procurement/getAllSlice";
import { fetchNotificationList } from "@/store/slice/procurement/getNotificationSlice";
import { deleteProcurement, resetDeleteState } from "@/store/slice/procurement/deleteSlice";
import { updateProgressProcData, resetUpdatedProgressProcurement } from "@/store/slice/procurement/progressUpdateSlice";
import { useSnackbar } from "notistack";
import { refetchProcurements } from "@/utils/refetchProcurements";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import { formatProgressProc } from "@/utils/formatProgress";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";
import ProjectBarChart from "@/components/common/chart/ProjectBarChart";
import { getProcurementChartData } from "@/utils/procurementChart";
import TablePagination from "@/components/common/pagination/TablePagination";
import NotifPagination from "@/components/common/pagination/NotifPagination";
import ProgressProcMenu from "@/components/common/modal/ProgressProcMenu";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();
    const { enqueueSnackbar } = useSnackbar();

    /* ------------------- Get All Procurement ------------------- */

    const [search, setSearch] = useState('');
    const { filteredProcurements: { procurementDataFiltered, currentPagesProc, totalPagesProc }, loading, allProcurements, summaryProcurements } = useAppSelector(state => state.procurementLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        dispatch(fetchSummaryProcurement({productId: selectedProduct?.id}));
        dispatch(fetchAllProcurements({productId: selectedProduct?.id}));
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredProcurement({
                    productId: selectedProduct.id,
                    prNumber: search,
                    page: 1
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedProduct?.id]);

    const chartData = getProcurementChartData(summaryProcurements);

    const handlePageProcChange = (newPage: number) => {
        if (!selectedProduct?.id) return;
        dispatch(fetchFilteredProcurement({
            productId: selectedProduct.id,
            prNumber: search,
            page: newPage
        }));
    };

    /* ------------------- End Get All Procurement ------------------- */


    /* ------------------- Get Procurement Notification ------------------- */

    const { notifications, loadingNotif } = useAppSelector(state => state.notificationProcLists);
    const { data, totalPages, currentPage } = notifications;

    useEffect(() => {
        if (selectedProduct) {
            dispatch(fetchNotificationList({ productId: selectedProduct.id, page: 1 }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id, dispatch]);

    const handlePageChange = (newPage: number) => {
        if (!selectedProduct?.id) return;
        dispatch(fetchNotificationList({ productId: selectedProduct?.id, page: newPage }));
    };

    /* ------------------- End Get Procurement Notification ------------------- */


    /* ------------------- Delete Procurement ------------------- */

    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteProcurement({ id: targetId }))
                .unwrap()
                .then(() => {
                    if (!selectedProduct?.id) return;
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchProcurements(dispatch, selectedProduct.id, search, targetId);
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Procurement ------------------- */


    /* ------------------- Modal Progress Procurement ------------------- */

    const [selectedProgress, setSelectedProgress] = useState<string>('');
    const [showProgressMenuId, setShowProgressMenuId] = useState<number | null>(null);

    const toggleProgress = (value: string) => {
        setSelectedProgress(value)
    };

    const handleUpdateProgress = (id: number) => {
        if (!selectedProduct?.id || !selectedProgress) return;
    
        dispatch(updateProgressProcData({ id, progress: selectedProgress.toLowerCase() }))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Progress updated successfully", { variant: "success" });
                dispatch(resetUpdatedProgressProcurement());
                refetchProcurements(dispatch, selectedProduct.id, search, targetId);
            })
            .catch(() => {
                enqueueSnackbar("Failed to update progress", { variant: "error" });
                dispatch(resetUpdatedProgressProcurement());
            });
    
        setShowProgressMenuId(null);
    }

    /* ------------------- End Modal Progress Procurement ------------------- */

    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Procurement"
                message="Are you sure you want to delete this procurement?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Procurement</p>
                <div className="flex justify-between">
                    <Link href="/development-status/procurement/add" prefetch>
                        <AddButton
                            buttonText="Add Procurement"
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
                        <h2 className="font-bold text-sm">Procurement Chart</h2>
                        <div className="flex justify-center">
                            <ProjectBarChart
                                title="Procurement Stats"
                                data={chartData}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-1/4 h-full">
                        <div className="bg-white p-5 rounded-[10px] flex flex-col max-h-[120px]">
                            <h3 className="text-sm font-bold">Total Procurement</h3>
                            <p className="mt-5 text-4xl font-bold text-center">{allProcurements}</p>
                        </div>
                        <div className="bg-white p-5 rounded-[10px]">
                            <h3 className="font-bold text-sm">Timeline Notification</h3>
                            <div className="flex flex-col gap-2 mt-5 relative">
                                {loadingNotif && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-[10px]">
                                        <p className="text-xs text-gray-500">Loading...</p>
                                    </div>
                                )}

                                <div className={`flex flex-col gap-2 transition-opacity duration-300 ${loadingNotif ? "opacity-50" : "opacity-100"}`}>
                                    {data.length > 0 ? (
                                    <>
                                        {data.map((notif) => (
                                            <div key={notif.id} className="flex items-center gap-[10px] p-2 bg-white rounded-[10px] border border-[#F5F5F5]">
                                                <div className="flex justify-center bg-[#FEF2F3] h-[40px] w-[40px] rounded-[10px]">
                                                    <Image src="/images/icon/calendar-1.svg" alt="Date Icon" width={18} height={20} />
                                                </div>
                                                <div className="flex flex-col gap-y-1">
                                                    <p className="font-bold text-xs">{notif.prNumber}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Due Date: {new Date(notif?.etaTarget).toLocaleDateString("en-GB")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {Array.from({ length: 4 - data.length }).map((_, i) => (
                                            <div key={`placeholder-${i}`} className="h-[58px] rounded-[10px] border border-[#F5F5F5] bg-[#FAFAFA]"/>
                                        ))}
                                    </>
                                    ) : (
                                    <>
                                        {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={`placeholder-${i}`} className="h-[58px] rounded-[10px] border border-[#F5F5F5] bg-[#FAFAFA]" />
                                        ))}
                                    </>
                                    )}
                                </div>
                                <NotifPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="overflow-x-auto rounded-lg bg-white p-[10px]">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-[#F5F5F5]">
                            <tr className="text-sm font-bold text-center">
                                <th className="py-5 px-4 text-left">No</th>
                                <th className="py-5 px-4 text-left min-w-[190px]">Item</th>
                                <th className="py-5 px-4 min-w-[150px]">PR Number</th>
                                <th className="py-5 px-4 min-w-[150px]">PO Number</th>
                                <th className="py-5 px-4 min-w-[120px]">ETA Target</th>
                                <th className="py-5 px-4 min-w-[150px]">Progress</th>
                                <th className="py-5 px-4 min-w-[130px]">Status</th>
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
                                    {procurementDataFiltered.length > 0 ? (
                                        procurementDataFiltered.map((proc, index) => {
                                            const colStyle = {
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                                            };

                                            const limit = 5;

                                            const displayIndex = ((currentPagesProc - 1) * limit + index + 1).toString().padStart(2, '0');

                                            return (
                                                <tr className="text-sm font-medium text-center" key={proc.id} style={colStyle}>
                                                    <td className="py-5 px-4 text-left">{displayIndex}</td>
                                                    <td className="py-5 px-4 text-left">{proc.itemName}</td>
                                                    <td className="py-5 px-4">{proc.prNumber}</td>
                                                    <td className="py-5 px-4 ">{proc.poNumber}</td>
                                                    <td className="py-5 px-4 ">{new Date(proc?.etaTarget).toLocaleDateString('en-GB')}</td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                        p-2 rounded-[5px] flex justify-center w-full
                                                                        ${(proc?.progress || '') === Progress.PRApproved ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                        ${(proc?.progress || '') === Progress.POConfirmed? 'text-[#059BFF] bg-[#CDEBFF]' : ''}
                                                                        ${(proc?.progress || '') === Progress.Paid? 'text-[#9966FF] bg-[#EBE0FF]' : ''}
                                                                        ${(proc?.progress || '') === Progress.Delivered? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                                                `}
                                                            >
                                                                <p> {formatProgressProc(proc.progress)} </p>
                                                            </div>
                                                            <div
                                                                onClick={() => {
                                                                    setShowProgressMenuId(prevId => {
                                                                        const newId = prevId === proc.id ? null : proc.id;
                                                                        if (newId !== null) {
                                                                            setSelectedProgress(proc.progress);
                                                                        }
                                                                        return newId;
                                                                    });
                                                                }}
                                                                className="flex justify-center items-center cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/menu.svg" alt="Menu Icon" width={15} height={15}/>
                                                            </div>
                                                        </div>
                                                        {showProgressMenuId === proc.id && (
                                                            <ProgressProcMenu
                                                                selectedProgress={selectedProgress}
                                                                onToggle={toggleProgress}
                                                                onSave={() => handleUpdateProgress(proc.id)}
                                                                onClose={() => setShowProgressMenuId(null)}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-4 text-xs">
                                                        <div
                                                            className={`
                                                                p-2 rounded-[5px] flex justify-center
                                                                ${proc.statusProc === StatusProc.Overdue ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                                                ${proc.statusProc === StatusProc.OnProgress ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                ${proc.statusProc === StatusProc.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                            `}
                                                        >
                                                            <p>{proc.statusProc.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex gap-[10px] justify-center">
                                                            <Link href={`/development-status/procurement/${proc.id}`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                    <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <Link href={`/development-status/procurement/${proc.id}/edit`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                    <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <div 
                                                                onClick={() => confirmDelete(proc.id)}
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
                        currentPage={currentPagesProc}
                        totalPages={totalPagesProc}
                        onPageChange={handlePageProcChange}
                    />
                </div>
            </div>
        </div>
    );
}