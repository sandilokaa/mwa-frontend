"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFilteredRecruitment, Progress, StatusRec, fetchAllRecruitments, fetchSummaryRecruitment } from "@/store/slice/recruitment/getAllSlice";
import { deleteRecruitment, resetDeleteState } from "@/store/slice/recruitment/deleteSlice";
import { fetchNotificationList } from "@/store/slice/recruitment/getNotificationSlice";
import { useSnackbar } from "notistack";
import { refetchRecruitments } from "@/utils/refetch/refetchRecruitment";
import { updateProgressRecData, resetUpdatedProgressRecruitment } from "@/store/slice/recruitment/progressUpdateSlice";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import { formatProgressRec } from "@/utils/format/formatProgress";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";
import BarChart from "@/components/common/chart/RecruitmentBarChart";
import { getRecruitmentChartData } from "@/utils/chart/recruitmentChart";
import TablePagination from "@/components/common/pagination/TablePagination";
import NotifPagination from "@/components/common/pagination/NotifPagination";
import ProgressRecMenu from "@/components/common/modal/ProgressRecMenu";
import CanAccess from "@/components/access/CanAccess";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    /* ------------------- Get All Recruitment ------------------- */

    const [search, setSearch] = useState('');
    const { filteredRecruitments: { recruitmentDataFiltered, currentPagesRec, totalPagesRec }, loading, allRecruitments, summaryRecruitments } = useAppSelector(state => state.recruitmentList);

    useEffect(() => {
        const delay = setTimeout(() => {
            dispatch(fetchSummaryRecruitment());
            dispatch(fetchAllRecruitments())
            dispatch(fetchFilteredRecruitment({
                name: search,
                page: 1
            }));
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const chartData = getRecruitmentChartData(summaryRecruitments);

    const handlePageProcChange = (newPage: number) => {
        dispatch(fetchFilteredRecruitment({
            name: search,
            page: newPage
        }));
    };

    /* ------------------- End Get All Recruitment ------------------- */


    /* ------------------- Get Recruitment Notification ------------------- */
    
    const { notifications, loadingNotif } = useAppSelector(state => state.notificationRecLists);
    const { data, totalPages, currentPage } = notifications;

    useEffect(() => {
            dispatch(fetchNotificationList({ page: 1 }));
    }, [dispatch]);

    const handlePageChange = (newPage: number) => {
        dispatch(fetchNotificationList({ page: newPage }));
    };
    
    /* ------------------- End Get Recruitment Notification ------------------- */


    /* ------------------- Delete Recruitment ------------------- */
    
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteRecruitment({ id: targetId }))
                .unwrap()
                .then(() => {
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchRecruitments(dispatch, search, targetId);
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };
    
    /* ------------------- End Delete Recruitment ------------------- */


    /* ------------------- Modal Progress Recruitment ------------------- */

    const [selectedProgress, setSelectedProgress] = useState<string>('');
    const [showProgressMenuId, setShowProgressMenuId] = useState<number | null>(null);

    const toggleProgress = (value: string) => {
        setSelectedProgress(value)
    };

    const handleUpdateProgress = (id: number) => {
    
        dispatch(updateProgressRecData({ id, progress: selectedProgress.toLowerCase() }))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Progress updated successfully", { variant: "success" });
                dispatch(resetUpdatedProgressRecruitment());
                refetchRecruitments(dispatch, search, targetId);
            })
            .catch(() => {
                enqueueSnackbar("Failed to update progress", { variant: "error" });
                dispatch(resetUpdatedProgressRecruitment());
            });
    
        setShowProgressMenuId(null);
    }

    /* ------------------- End Modal Progress Recruitment ------------------- */


    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Recruitment"
                message="Are you sure you want to delete this Recruitment?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Recruitment</p>
                <div className="flex justify-between">
                    <CanAccess roles={['RnE']}>
                        <Link href="/recruitment/add" prefetch>
                            <AddButton
                                buttonText="Add Recruitment"
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
                        <h2 className="font-bold text-sm">Recruitment Chart</h2>
                        <div className="flex justify-center">
                            <BarChart
                                data={chartData}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-1/4 h-full">
                        <div className="bg-white p-5 rounded-[10px] flex flex-col max-h-[120px]">
                            <h3 className="text-sm font-bold">Total Recruitment</h3>
                            <p className="mt-5 text-4xl font-bold text-center">{allRecruitments}</p>
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
                                                    <p className="font-bold text-xs">{notif?.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Join Date: {new Date(notif?.joinDate).toLocaleDateString("en-GB")}
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
                                <th className="py-5 px-4 text-left min-w-[190px]">Name</th>
                                <th className="py-5 px-4 min-w-[150px]">Position</th>
                                <th className="py-5 px-4 min-w-[150px]">Division</th>
                                <th className="py-5 px-4 min-w-[120px]">Join Date</th>
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
                                    {recruitmentDataFiltered.length > 0 ? (
                                        recruitmentDataFiltered.map((rec, index) => {
                                            const colStyle = {
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                                            };

                                            const limit = 5;

                                            const displayIndex = ((currentPagesRec - 1) * limit + index + 1).toString().padStart(2, '0');

                                            return (
                                                <tr className="text-sm font-medium text-center" key={rec.id} style={colStyle}>
                                                    <td className="py-5 px-4 text-left">{displayIndex}</td>
                                                    <td className="py-5 px-4 text-left">{rec.name}</td>
                                                    <td className="py-5 px-4">{rec.position}</td>
                                                    <td className="py-5 px-4 ">{rec.division}</td>
                                                    <td className="py-5 px-4 ">{new Date(rec?.joinDate).toLocaleDateString('en-GB')}</td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                        p-2 rounded-[5px] flex justify-center w-full
                                                                        ${(rec?.progress || '') === Progress.InterviewHR ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                        ${(rec?.progress || '') === Progress.InterviewUser? 'text-[#059BFF] bg-[#CDEBFF]' : ''}
                                                                        ${(rec?.progress || '') === Progress.InterviewComben? 'text-[#9966FF] bg-[#EBE0FF]' : ''}
                                                                        ${(rec?.progress || '') === Progress.OfferLetter? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                                                `}
                                                            >
                                                                <p> {formatProgressRec(rec.progress)} </p>
                                                            </div>
                                                            <CanAccess roles={['RnE']}>
                                                                <div
                                                                    onClick={() => {
                                                                        setShowProgressMenuId(prevId => {
                                                                            const newId = prevId === rec.id ? null : rec.id;
                                                                            if (newId !== null) {
                                                                                setSelectedProgress(rec.progress);
                                                                            }
                                                                            return newId;
                                                                        });
                                                                    }}
                                                                    className="flex justify-center items-center cursor-pointer"
                                                                >
                                                                    <Image src="/images/icon/menu.svg" alt="Menu Icon" width={15} height={15}/>
                                                                </div>
                                                            </CanAccess>
                                                        </div>
                                                        {showProgressMenuId === rec.id && (
                                                            <ProgressRecMenu
                                                                selectedProgress={selectedProgress}
                                                                onToggle={toggleProgress}
                                                                onSave={() => handleUpdateProgress(rec.id)}
                                                                onClose={() => setShowProgressMenuId(null)}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-4 text-xs">
                                                        <div
                                                            className={`
                                                                p-2 rounded-[5px] flex justify-center
                                                                ${rec.statusRec === StatusRec.Overdue ? 'text-[#EB575F] bg-[#FEF2F3]' : ''}
                                                                ${rec.statusRec === StatusRec.OnProgress ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                ${rec.statusRec === StatusRec.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                            `}
                                                        >
                                                            <p>{rec.statusRec.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex gap-[10px] justify-center">
                                                            <Link href={`/recruitment/${rec.id}`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                    <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <CanAccess roles={['RnE']}>
                                                                <Link href={`/recruitment/${rec.id}/edit`} prefetch>
                                                                    <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                        <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                                                    </div>
                                                                </Link>
                                                                <div 
                                                                    onClick={() => confirmDelete(rec.id)}
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
                        currentPage={currentPagesRec}
                        totalPages={totalPagesRec}
                        onPageChange={handlePageProcChange}
                    />
                </div>
            </div>
        </div>
    );
}