import { useRef, useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useProductFilter } from "@/context/ProductFilterContext";
import { fetchFilteredSchedule } from "@/store/slice/schedule/getAllSlice";
import { 
    generateMonthYearData, 
    getCurrentWeekPosition,
    MonthYearData,
    MONTH_NAMES
} from "@/utils/schedule/calendar";
import { 
    processSchedulesByPic, 
    calculatePicRowHeights 
} from "@/utils/schedule/schedule";

export const useScheduleCalendar = () => {
    const dispatch = useAppDispatch();
    const { selectedProduct } = useProductFilter();

    const currentWeekRef = useRef<HTMLDivElement | null>(null);
    const [lineLeft, setLineLeft] = useState<number | null>(null);
    const [monthYearData, setMonthYearData] = useState<MonthYearData[]>([]);
    const years = useMemo(() => Array.from({length: 11}, (_, i) => 2024 + i), []);

    useEffect(() => {
        const data = generateMonthYearData(2024, 11);
        setMonthYearData(data);
    }, []);

    useEffect(() => {
        if (currentWeekRef.current && monthYearData.length > 0) {
            const el = currentWeekRef.current;
            el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            
            const linePosition = getCurrentWeekPosition(monthYearData);
            setLineLeft(linePosition);
        }
    }, [monthYearData]);

    const { filteredSchedule } = useAppSelector(state => state.scheduleLists);

    useEffect(() => {
        if (!selectedProduct?.id) return;
        
        const delay = setTimeout(() => {
            if (selectedProduct) {
                dispatch(fetchFilteredSchedule({
                    productId: selectedProduct.id,
                }));
            }
        }, 500);
        
        return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct?.id, dispatch]);

    const schedulesByPic = useMemo(() => {
        return processSchedulesByPic(filteredSchedule || [], monthYearData);
    }, [filteredSchedule, monthYearData]);

    const picRowHeights = useMemo(() => {
        return calculatePicRowHeights(schedulesByPic);
    }, [schedulesByPic]);

    return {
        currentWeekRef,
        years,
        monthNames: MONTH_NAMES,
        monthYearData,
        lineLeft,
        schedulesByPic,
        picRowHeights,
    };
};