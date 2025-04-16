"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredProcurement, Progress, StatusProc, fetchAllProcurements } from "@/store/slice/procurement/getAllSlice";
import { fetchNotificationList } from "@/store/slice/procurement/getNotificationSlice";
import { deleteProcurement, resetDeleteState } from "@/store/slice/procurement/deleteSlice";
import { useSnackbar } from "notistack";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import { formatProgress } from "@/utils/formatProgress";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";
import BarChart from "@/components/common/chart/BarChart";
import { getProcurementChartData } from "@/utils/procurementChart";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();
    const { enqueueSnackbar } = useSnackbar();

    /* ------------------- Get All Procurement ------------------- */
    const [search, setSearch] = useState('');
    const { filteredProcurements, loading, allProcurements } = useAppSelector(state => state.procurementLists);

    const chartData = getProcurementChartData(allProcurements);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        dispatch(fetchAllProcurements({productId: selectedProduct?.id}));
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredProcurement({
                    productId: selectedProduct.id,
                    prNumber: search
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedProduct?.id]);
    /* ------------------- End Get All Procurement ------------------- */

    /* ------------------- Get Procurement Notification ------------------- */

    const { notifications, loadingNotif } = useAppSelector(state => state.notificationLists);

    useEffect(() => {
        if (selectedProduct) {
            dispatch(fetchNotificationList({ productId: selectedProduct.id }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id]);

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
                    dispatch(fetchAllProcurements({productId: selectedProduct?.id}));
                    dispatch(fetchFilteredProcurement({
                        productId: selectedProduct.id,
                        prNumber: search
                    }));
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Procurement ------------------- */

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
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Procurement Chart</h2>
                        <div className="flex justify-center mt-[15px]">
                            <div className="w-full h-auto">
                                <BarChart
                                    title="Procurement Stats"
                                    data={chartData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-rows-[auto_auto] gap-5">
                        <div className="bg-white p-5 rounded-[10px] flex flex-col max-h-[120px]">
                            <h3 className="text-sm font-bold">Total Procurement</h3>
                            <p className="mt-5 text-4xl font-bold text-center">{allProcurements.length}</p>
                        </div>
                        <div className="bg-white p-5 rounded-[10px]">
                            <h3 className="font-bold text-sm">Timeline Notification</h3>
                            <div className="space-y-2 mt-5">
                                {loadingNotif ? (
                                    <div className="flex items-center gap-[10px] p-2 bg-white rounded-[10px] border border-[#F5F5F5]">
                                        <p className="text-xs font-normal">Loading...</p>
                                    </div>
                                ) : (
                                    <>
                                        {notifications.length > 0 ? (
                                            <>
                                                {notifications.map((notif) => (
                                                    <div key={notif.id} className="flex items-center gap-[10px] p-2 bg-white rounded-[10px] border border-[#F5F5F5]">
                                                        <div className="flex justify-center bg-[#FEF2F3] h-[40px] w-[40px] rounded-[10px]">
                                                                <Image src="/images/icon/calendar-1.svg" alt="Date Icon" width={18} height={20} />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <p className="font-bold text-xs">{notif.prNumber}</p>
                                                            <p className="text-xs text-gray-500">Due Date: {new Date(notif?.etaTarget).toLocaleDateString('en-GB')}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {Array.from({ length: 4 - notifications.length }).map((_, i) => (
                                                    <div key={`placeholder-${i}`} className="h-[58px] rounded-[10px] border border-[#F5F5F5] bg-[#FAFAFA]"/>
                                                ))}
                                            </>
                                            ) : (
                                            <>
                                                <p className="text-sm font-normal">No data found</p>
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={`placeholder-${i}`} className="h-[58px] rounded-[10px] border border-[#F5F5F5] bg-[#FAFAFA]" />
                                                ))}
                                            </>
                                            )}

                                    </>
                                )}
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
                                    {filteredProcurements.length > 0 ? (
                                        filteredProcurements.map((proc, index) => {
                                            const colStyle = {
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                                            };

                                            const displayIndex = (index + 1).toString().padStart(2, '0');

                                            return (
                                                <tr className="text-sm font-medium text-center" key={proc.id} style={colStyle}>
                                                    <td className="py-5 px-4 text-left">{displayIndex}</td>
                                                    <td className="py-5 px-4 text-left">{proc.itemName}</td>
                                                    <td className="py-5 px-4">{proc.prNumber}</td>
                                                    <td className="py-5 px-4 ">{proc.poNumber}</td>
                                                    <td className="py-5 px-4 ">{new Date(proc?.etaTarget).toLocaleDateString('en-GB')}</td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex justify-center">
                                                            <p
                                                                className={`
                                                                    p-2 rounded-[5px] 
                                                                    ${(proc?.progress || '') === Progress.PRApproved ? 'text-[#1B5E20] bg-[#E1F3E4]' : ''}
                                                                    ${(proc?.progress || '') === Progress.POConfirmed? 'text-[#6A1B9A] bg-[#EFE7F6]' : ''}
                                                                    ${(proc?.progress || '') === Progress.Paid? 'text-[#0D47A1] bg-[#E3EBFA]' : ''}
                                                                    ${(proc?.progress || '') === Progress.Delivered? 'text-[#424242] bg-[#EEEEEE]' : ''}
                                                                `}
                                                            >
                                                                {formatProgress(proc.progress)}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex justify-center">
                                                            <p
                                                                className={`
                                                                    p-2 rounded-[5px] 
                                                                    ${proc.statusProc === StatusProc.Overdue ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                                                    ${proc.statusProc === StatusProc.OnProgress ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                `}
                                                            >
                                                                {proc.statusProc.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())}
                                                            </p>
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
                </div>
            </div>
        </div>
    );
}