"use client"

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { useState, useEffect } from "react";
import { fetchFilteredEngineering, Status2D, Status3D, StatusDXF, fetchSummaryEngineeringStatus } from "@/store/slice/engineering/getAllSlice";
import { getEffectiveCategory } from "@/utils/filter/effetiveCategory";
import { deleteEngineering, resetDeleteState } from "@/store/slice/engineering/deleteSlice";
import { useSnackbar } from "notistack";
import { refetchEngineerings } from "@/utils/refetch/refecthEngineering";
import DoughnutChart from "@/components/common/chart/DoughnutChart";
import { getEngineeringChartData } from "@/utils/chart/engineeringChart";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { StatusEngineeringOptions } from "@/utils/status/statusOption";
import { updateEngineeringStatusData, resetUpdatedStatusEngineering } from "@/store/slice/engineering/statusUpdateSlice";

import AddButton from "@/components/common/button/AddButton";
import SearchInput from "@/components/common/input/SearchInput";
import DropdownCategory from "@/components/common/dropdown/DropdownFilterCategory";
import TablePagination from "@/components/common/pagination/TablePagination";
import ConfirmDialog from "@/components/common/modal/ConfirmDialog";
import StatusMenu from "@/components/common/modal/StatusMenu";

export default function ShowData() {

    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();
    const { enqueueSnackbar } = useSnackbar();
    
    /* ------------------- Get All Engineering ------------------- */
    
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("Overall");
    const { filteredEngineerings: { engineeringDataFiltered, currentPagesEngine, totalPagesEngine }, loading, summaryEngineering } = useAppSelector(state => state.engineeringLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        const delay = setTimeout(() => {
            dispatch(fetchSummaryEngineeringStatus({ productId: selectedProduct.id, category: getEffectiveCategory(selectedCategory) }));
            if (selectedProduct) {
                dispatch(fetchFilteredEngineering({
                    productId: selectedProduct.id,
                    partName: search,
                    page: 1,
                    category: getEffectiveCategory(selectedCategory)
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedCategory, selectedProduct?.id]);

    const slides = [
        {
            title: 'Status Overview 3D',
            data: getEngineeringChartData(summaryEngineering.status3D, 'status3D'),
            label: `${selectedCategory} 3D Progress`,
        },
        {
            title: 'Status Overview 2D',
            data: getEngineeringChartData(summaryEngineering.status2D, 'status2D'),
            label: `${selectedCategory} 2D Progress`,
        },
        {
            title: 'Status Overview DXF',
            data: getEngineeringChartData(summaryEngineering.statusDXF, 'statusDXF'),
            label: `${selectedCategory} DXF Progress`,
        },
    ];

    const handlePageProdChange = (newPage: number) => {
        if (!selectedProduct?.id) return;
        dispatch(fetchFilteredEngineering({
            productId: selectedProduct.id,
            partName: search,
            page: newPage,
            category: getEffectiveCategory(selectedCategory)
        }));
    };

    /* ------------------- End Get All Engineering ------------------- */


    /* ------------------- Delete Engineering ------------------- */
    
    const [openConfirm, setOpenConfirm] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const confirmDelete = (id: number) => {
        setTargetId(id);
        setOpenConfirm(true);
    };

    const handleConfirmedDelete = () => {
        if (targetId !== null) {
            dispatch(deleteEngineering({ id: targetId }))
                .unwrap()
                .then(() => {
                    if (!selectedProduct?.id) return;
                    enqueueSnackbar("You have successfully deleted the data", { variant: "success" });
                    dispatch(resetDeleteState());
                    refetchEngineerings(dispatch, selectedProduct.id, search, getEffectiveCategory(selectedCategory));
                })
                .catch(() => {
                    enqueueSnackbar("You failed to delete data", { variant: "error" });
                    dispatch(resetDeleteState());
                })
        }
        setOpenConfirm(false);
    };

    /* ------------------- End Delete Engineering ------------------- */


    /* ------------------- Modal Status Engineering ------------------- */

    const [selectedStatus, setSelectedStatus] = useState<{
        [id: number]: {
            status3D?: string;
            status2D?: string;
            statusDXF?: string;
        };
    }>({});
    const [showStatusMenu, setShowStatusMenu] = useState<{
        [id: number]: {
            status3D?: boolean;
            status2D?: boolean;
            statusDXF?: boolean;
        };
    }>({});

    const toggleStatusMenu = (id: number, type: "status3D" | "status2D" | "statusDXF") => {
        setShowStatusMenu(prev => ({
            ...prev,
            [id]: {
            ...prev[id],
            [type]: !prev[id]?.[type],
            },
        }));

        setSelectedStatus(prev => ({
            ...prev,
            [id]: {
            ...prev[id],
            [type]: engineeringDataFiltered.find(item => item.id === id)?.[type] || "",
            },
        }));
    };

    const handleUpdateStatus = (id: number, type: "status2D" | "status3D" | "statusDXF") => {
        const selected = selectedStatus[id]?.[type];

        if (!selectedProduct?.id || !selected) return;

        const payload = {
            id,
            [type]: selected.toLowerCase(),
        };

        dispatch(updateEngineeringStatusData(payload))
            .unwrap()
            .then(() => {
                enqueueSnackbar("Progress updated successfully", { variant: "success" });
                dispatch(resetUpdatedStatusEngineering());
                refetchEngineerings(dispatch, selectedProduct.id, search, getEffectiveCategory(selectedCategory));
                })
            .catch(() => {
                enqueueSnackbar("Failed to update progress", { variant: "error" });
                dispatch(resetUpdatedStatusEngineering());
            });

        setShowStatusMenu({});
    };

    /* ------------------- Modal Status Engineering ------------------- */

    return (
        <div>
            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmedDelete}
                title="Delete Engineering"
                message="Are you sure you want to delete this engineering?"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <div className="flex flex-col gap-y-5">
                <p className="font-bold">Design Engineering</p>
                <div className="flex justify-between">
                    <Link href="/development-status/engineering/add">
                        <AddButton
                            buttonText="Add Design Engineering"
                        />
                    </Link>
                    <div className="flex gap-4">
                        <DropdownCategory
                            options={["Overall", "Chassis", "Under Body", "Upper Body", "Exterior", "Interior"]}
                            onSelect={(value) => setSelectedCategory(value)}
                            defaultValue="Overall"
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
                        <h2 className="font-bold text-sm">Cumulative Design Engineering Performance</h2>
                        <div className="flex justify-center">
                        </div>
                    </div>
                    <div className="flex flex-col w-1/3 h-full bg-white p-5 rounded-[10px] gap-5">
                        <h2 className="font-bold text-sm">Design Engineering Status Overview</h2>
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            modules={[Pagination]}
                            className="w-full max-w-md mx-auto cursor-pointer"
                        >
                            {slides.map((slide, index) => (
                                <SwiperSlide key={index}>
                                    <div className="flex flex-col items-center gap-2">
                                        <DoughnutChart title={slide.title} data={slide.data} />
                                        <p className="text-sm font-bold">{slide.label}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
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
                                <th className="py-5 px-4 min-w-[170px]">Remarks</th>
                                <th className="py-5 px-4 min-w-[120px]">Status 3D</th>
                                <th className="py-5 px-4 min-w-[120px]">Status 2D</th>
                                <th className="py-5 px-4 min-w-[120px]">Status DXF</th>
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
                                    {engineeringDataFiltered.length > 0 ? (
                                        engineeringDataFiltered.map((engine, index) => {
                                            const colStyle = {
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                                            };

                                            const limit = 5;

                                            const displayIndex = ((currentPagesEngine - 1) * limit + index + 1).toString().padStart(2, '0');

                                            return (
                                                <tr className="text-sm font-medium text-center" key={engine.id} style={colStyle}>
                                                    <td className="py-5 px-4 text-left">{displayIndex}</td>
                                                    <td className="py-5 px-4 text-left">{engine.partName}</td>
                                                    <td className="py-5 px-4">{engine.drawingNumber}</td>
                                                    <td className="py-5 px-4 text-left">
                                                        <div className="flex line-clamp-3">
                                                            {engine.remark}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                        p-2 rounded-[5px] flex justify-center w-full
                                                                        ${engine.status3D === Status3D.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                                                        ${engine.status3D === Status3D.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                        ${engine.status3D === Status3D.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                `}
                                                            >
                                                                <p>{engine.status3D.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                            </div>
                                                            <div
                                                                onClick={() => toggleStatusMenu(engine.id, "status3D")}
                                                                className="flex justify-center items-center cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/menu.svg" alt="Menu Icon" width={15} height={15}/>
                                                            </div>
                                                        </div>
                                                        {showStatusMenu[engine.id]?.status3D && (
                                                            <StatusMenu
                                                                selectedStatus={selectedStatus[engine.id]?.status3D || ""}
                                                                onToggle={(status) =>
                                                                    setSelectedStatus(prev => ({
                                                                        ...prev,
                                                                        [engine.id]: {
                                                                        ...prev[engine.id],
                                                                        status3D: status,
                                                                        },
                                                                    }))
                                                                }
                                                                onSave={() => handleUpdateStatus(engine.id, "status3D")}
                                                                onClose={() =>
                                                                    setShowStatusMenu(prev => ({
                                                                        ...prev,
                                                                        [engine.id]: {
                                                                        ...prev[engine.id],
                                                                        status3D: false,
                                                                        },
                                                                    }))
                                                                }
                                                                statusOptions={StatusEngineeringOptions}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                        p-2 rounded-[5px] flex justify-center w-full
                                                                        ${engine.status2D === Status2D.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                                                        ${engine.status2D === Status2D.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                        ${engine.status2D === Status2D.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                `}
                                                            >
                                                                <p>{engine.status2D.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                            </div>
                                                            <div
                                                                onClick={() => toggleStatusMenu(engine.id, "status2D")}
                                                                className="flex justify-center items-center cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/menu.svg" alt="Menu Icon" width={15} height={15}/>
                                                            </div>
                                                        </div>
                                                        {showStatusMenu[engine.id]?.status2D && (
                                                            <StatusMenu
                                                                selectedStatus={selectedStatus[engine.id]?.status2D || ""}
                                                                onToggle={(status) =>
                                                                    setSelectedStatus(prev => ({
                                                                        ...prev,
                                                                        [engine.id]: {
                                                                        ...prev[engine.id],
                                                                        status2D: status,
                                                                        },
                                                                    }))
                                                                }
                                                                onSave={() => handleUpdateStatus(engine.id, "status2D")}
                                                                onClose={() =>
                                                                    setShowStatusMenu(prev => ({
                                                                        ...prev,
                                                                        [engine.id]: {
                                                                        ...prev[engine.id],
                                                                        status2D: false,
                                                                        },
                                                                    }))
                                                                }
                                                                statusOptions={StatusEngineeringOptions}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-4 text-xs relative">
                                                        <div className="flex justify-between gap-1">
                                                            <div 
                                                                className={`
                                                                        p-2 rounded-[5px] flex justify-center w-full
                                                                        ${engine.statusDXF === StatusDXF.NotYet ? 'text-[#7a7b7d] bg-[#F4F5F5]' : ''}
                                                                        ${engine.statusDXF === StatusDXF.OnGoing ? 'text-[#ae8c02] bg-[#FFF9C4]' : ''}
                                                                        ${engine.statusDXF === StatusDXF.Done ? 'text-[#3e9c9c] bg-[#DBF2F2]' : ''}
                                                                `}
                                                            >
                                                                <p>{engine.statusDXF.replace(/(?:^|\s)\S/g, (match: string) => match.toUpperCase())}</p>
                                                            </div>
                                                            <div
                                                                onClick={() => toggleStatusMenu(engine.id, "statusDXF")}
                                                                className="flex justify-center items-center cursor-pointer"
                                                            >
                                                                <Image src="/images/icon/menu.svg" alt="Menu Icon" width={15} height={15}/>
                                                            </div>
                                                        </div>
                                                        {showStatusMenu[engine.id]?.statusDXF && (
                                                            <StatusMenu
                                                                selectedStatus={selectedStatus[engine.id]?.statusDXF || ""}
                                                                onToggle={(status) =>
                                                                    setSelectedStatus(prev => ({
                                                                        ...prev,
                                                                        [engine.id]: {
                                                                        ...prev[engine.id],
                                                                        statusDXF: status,
                                                                        },
                                                                    }))
                                                                }
                                                                onSave={() => handleUpdateStatus(engine.id, "statusDXF")}
                                                                onClose={() =>
                                                                    setShowStatusMenu(prev => ({
                                                                        ...prev,
                                                                        [engine.id]: {
                                                                        ...prev[engine.id],
                                                                        statusDXF: false,
                                                                        },
                                                                    }))
                                                                }
                                                                statusOptions={StatusEngineeringOptions}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex gap-[10px] justify-center">
                                                            <Link href={`/development-status/engineering/${engine.id}`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#2181E8] cursor-pointer">
                                                                    <Image src="/images/icon/eye.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <Link href={`/development-status/engineering/${engine.id}/edit`} prefetch>
                                                                <div className="p-2 rounded-sm bg-[#FDBE1B] cursor-pointer">
                                                                    <Image src="/images/icon/edit-2.svg" alt="view icon" height={16} width={16}/>
                                                                </div>
                                                            </Link>
                                                            <div 
                                                                onClick={() => confirmDelete(engine.id)}
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
                        currentPage={currentPagesEngine}
                        totalPages={totalPagesEngine}
                        onPageChange={handlePageProdChange}
                    />
                </div>
            </div>
        </div>
    );
}