"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchNotificationList } from "@/store/slice/highlightIssue/getNotificationSlice";
import { fetchFilteredIssue, fetchSummaryIssue, StatusIssue, fetchIssueMetrics} from "@/store/slice/highlightIssue/getAllSlice";
import { deleteIssue, resetDeleteState } from "@/store/slice/highlightIssue/deleteSlice";
import { updateRevisionIssueData, resetUpdatedRevisionIssue } from "@/store/slice/highlightIssue/revisionDateSlice";
import { useSnackbar } from "notistack";
import { refetchHighlightIssues } from "@/utils/refetch/refetchHighlightIssue";
import { resetUpdatedStatusIssue, updateStatusIssueData } from "@/store/slice/highlightIssue/statusUpdateSlice";
import { getIssueChartData } from "@/utils/chart/issueChart";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import NotifPagination from "@/components/common/pagination/NotifPagination";
import TablePagination from "@/components/common/pagination/TablePagination";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";
import StatusMenu from "@/components/common/modal/StatusMenu";
import ProjectBarChart from "@/components/common/chart/ProjectBarChart";
import { AlertCircle } from 'lucide-react';
import OverdueModal from "@/components/common/modal/OverdueModal";
import { getIssueOptions } from "@/utils/status/getIssueOption";
import CanAccess from "@/components/access/CanAccess";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { selectedProduct } = useProductFilter();

    /* ------------------- Get All Highlight Issue ------------------- */
    
    const [search, setSearch] = useState('');
    const { filteredIssues: { highlightDataFiltered, currentPagesHI, totalPagesHI }, loading, issueMetrics, summaryIssues } = useAppSelector(state => state.issueLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        const delay = setTimeout(() => {
            dispatch(fetchSummaryIssue({ productId: selectedProduct.id }));
            dispatch(fetchIssueMetrics({ productId: selectedProduct.id }))
            if (selectedProduct) {
                dispatch(fetchFilteredIssue({
                    productId: selectedProduct.id,
                    itemName: search,
                    page: 1
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedProduct?.id]);

    const chartData = getIssueChartData(summaryIssues);

    const handlePageHIChange = (newPage: number) => {
        if (!selectedProduct?.id) return;
        dispatch(fetchFilteredIssue({
            productId: selectedProduct.id,
            itemName: search,
            page: newPage
        }));
    };

    /* ------------------- End Get All Highlight Issue ------------------- */


    /* ------------------- Get Highlight Issue Notification ------------------- */
    
    const { notifications, loadingNotif } = useAppSelector(state => state.notificationIssueLists);
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

    /* ------------------- End Get Highlight Issue Notification ------------------- */


    /* ------------------- Delete Highlight Issue ------------------- */
    
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteIssue({ id: targetId }))
                .unwrap()
                .then(() => {
                    if (!selectedProduct?.id) return;
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchHighlightIssues(dispatch, selectedProduct.id, search, targetId);
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Highlight Issue ------------------- */


    /* ------------------- Modal Status Highlight Issue ------------------- */
    
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [showStatusMenuId, setShowStatusMenuId] = useState<number | null>(null);

    const toggleStatus = (value: string) => {
        setSelectedStatus(value)
    };

    const handleUpdateStatus = (id: number) => {
        if (!selectedProduct?.id || !selectedStatus) return;
    
        dispatch(updateStatusIssueData({ id, statusIssue: selectedStatus.toLowerCase() }))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Status updated successfully", { variant: "success" });
                dispatch(resetUpdatedStatusIssue());
                refetchHighlightIssues(dispatch, selectedProduct.id, search, targetId);
            })
            .catch(() => {
                enqueueSnackbar("Failed to update status", { variant: "error" });
                dispatch(resetUpdatedStatusIssue());
            });
    
            setShowStatusMenuId(null);
    }

    /* ------------------- End Modal Status Highlight Issue ------------------- */


    /* ------------------- Modal Update Revision Date ------------------- */

    const [showOverdueModal, setShowOverdueModal] = useState(false);
    const [selectedIssueForModal, setSelectedIssueForModal] = useState<{ id: number; itemName: string } | null>(null);

    const revisionDateRef = useRef<HTMLInputElement>(null);

    const handleUpdateRevision = (id: number) => {
        if (!selectedProduct?.id || !revisionDateRef.current?.value) return;
    
        const revisionDate = revisionDateRef.current.value;
    
        dispatch(updateRevisionIssueData({ id, revisionDate }))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Revision date updated successfully", { variant: "success" });
                dispatch(resetUpdatedRevisionIssue());
                refetchHighlightIssues(dispatch, selectedProduct.id, search, targetId);
            })
            .catch(() => {
                enqueueSnackbar("Failed to update revision date", { variant: "error" });
                dispatch(resetUpdatedRevisionIssue());
            });
    
        setShowOverdueModal(false);
    };

    /* ------------------- End Modal Update Revision Date ------------------- */


    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Issue"
                message="Are you sure you want to delete this issue?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Highlight Issue</p>
                <div className="flex justify-between">
                    <CanAccess roles={['RnE']}>
                        <Link href="/highlight-issue/add">
                            <AddButton
                                buttonText="Add Highlight Issue"
                            />
                        </Link>
                    </CanAccess>
                    <SearchInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-5">
                <div className="flex gap-4 w-full">
                    <div className="flex flex-col justify-between w-3/4 bg-white p-5 rounded-[10px]">
                        <h2 className="font-bold text-sm">Highlight Issue Chart</h2>
                        <div className="flex justify-center">
                            <ProjectBarChart
                                title="Highlight Issue Stats"
                                data={chartData}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-1/4 h-full">
                        <div className="bg-white p-5 rounded-[10px] flex flex-col">
                            <h3 className="text-sm font-bold">Total Issue</h3>
                            <p className="mt-5 text-4xl font-bold text-center">{issueMetrics}</p>
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
                                                        <p className="font-bold text-xs">{notif?.itemName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Due Date: {new Date(notif?.dueDate).toLocaleDateString("en-GB")}
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
                <div className="rounded-lg bg-white p-[10px]">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-[#F5F5F5]">
                            <tr className="text-sm font-bold text-center">
                                <th className="py-5 px-4 text-left">No</th>
                                <th className="py-5 px-4 text-left min-w-[180px]">Item</th>
                                <th className="py-5 px-4 min-w-[200px]">Issue</th>
                                <th className="py-5 px-4 min-w-[130px]">PIC (C/M)</th>
                                <th className="py-5 px-4 min-w-[120px]">Due Date</th>
                                <th className="py-5 px-4 min-w-[130px]">Revision Date</th>
                                <th className="py-5 px-4 min-w-[150px]">Status</th>
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
                                    {highlightDataFiltered.length > 0 ? (
                                        highlightDataFiltered.map((issue, index) => {
                                            const colStyle = {
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                                            };

                                            const limit = 5;

                                            const displayIndex = ((currentPagesHI - 1) * limit + index + 1).toString().padStart(2, '0');

                                            return (
                                                <tr className="text-sm font-medium text-center" key={issue.id} style={colStyle}>
                                                    <td className="py-5 px-4 text-left">{displayIndex}</td>
                                                    <td className="py-5 px-4 text-left">{issue.itemName}</td>
                                                    <td className="py-5 px-4 text-left">
                                                        <div className="line-clamp-3">
                                                            {issue.issue}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4">{issue.pic}</td>
                                                    <td className="py-5 px-4">{new Date(issue?.dueDate).toLocaleDateString('en-GB')}</td>
                                                    <td className="py-5 px-4">
                                                        {issue.revisionDate === null  ? (
                                                            <p>-</p>
                                                        ): (
                                                            <p>{new Date(issue?.revisionDate).toLocaleDateString('en-GB')}</p>
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                    p-2 rounded-[5px] flex justify-center w-full
                                                                    ${issue.statusIssue === StatusIssue.Overdue ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                                                    ${issue.statusIssue === StatusIssue.OnProgress ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                    ${issue.statusIssue === StatusIssue.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                `}
                                                            >
                                                                <p>{issue.statusIssue.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                            </div>
                                                            <CanAccess roles={['RnE']}>
                                                                <div
                                                                    className="flex justify-center items-center cursor-pointer"
                                                                >
                                                                    {issue.statusIssue !== StatusIssue.Done && (
                                                                        <div className="flex justify-center items-center cursor-pointer">
                                                                            {issue.statusIssue === StatusIssue.Overdue && !issue.revisionDate ? (
                                                                                <AlertCircle 
                                                                                    onClick={() => {
                                                                                        setSelectedIssueForModal(issue);
                                                                                        setShowOverdueModal(true);
                                                                                    }}
                                                                                    size={15} 
                                                                                    className="text-red-500" 
                                                                                />
                                                                            ) : (
                                                                                <Image 
                                                                                    onClick={() => {
                                                                                        setShowStatusMenuId(prevId => {
                                                                                            const newId = prevId === issue.id ? null : issue.id;
                                                                                            if (newId !== null) {
                                                                                                setSelectedStatus(issue.statusIssue);
                                                                                            }
                                                                                            return newId;
                                                                                        });
                                                                                    }}
                                                                                    src="/images/icon/menu.svg" 
                                                                                    alt="Menu Icon" 
                                                                                    width={15} 
                                                                                    height={15} 
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </CanAccess>
                                                        </div>
                                                        {showStatusMenuId === issue.id && (
                                                            <StatusMenu
                                                                selectedStatus={selectedStatus}
                                                                onToggle={toggleStatus}
                                                                onSave={() => handleUpdateStatus(issue.id)}
                                                                onClose={() => setShowStatusMenuId(null)}
                                                                statusOptions={getIssueOptions(issue.statusIssue, issue.revisionDate)}
                                                            />
                                                        )}
                                                        {showOverdueModal && selectedIssueForModal && (
                                                            <OverdueModal
                                                                open={true}
                                                                onSave={() => {
                                                                    if (selectedIssueForModal) handleUpdateRevision(selectedIssueForModal.id);
                                                                }}
                                                                onClose={() => setShowOverdueModal(false)}
                                                                issue={selectedIssueForModal}
                                                                ref={revisionDateRef}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex gap-[10px] justify-center">
                                                            <Link href={`/highlight-issue/${issue.id}`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                    <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <CanAccess roles={['RnE']}>
                                                                <Link href={`/highlight-issue/${issue.id}/edit`} prefetch>
                                                                    <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                        <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                                                    </div>
                                                                </Link>
                                                                <div 
                                                                    onClick={() => confirmDelete(issue.id)}
                                                                    className="p-2 rounded-sm bg-[#D62C35] cursor-pointer"
                                                                >
                                                                    <Image src="/images/icon/trash.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </CanAccess>
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
                        currentPage={currentPagesHI}
                        totalPages={totalPagesHI}
                        onPageChange={handlePageHIChange}
                    />
                </div>
            </div>
        </div>
    );
}