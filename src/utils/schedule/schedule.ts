import { MonthYearData, SchedulePosition, ScheduleWithPosition, TIMELINE_CONFIG } from './calendar';

export const calculateSchedulePosition = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schedule: any,
    monthYearData: MonthYearData[]
): SchedulePosition => {
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);
    
    let startWeek: {start: Date, end: Date} | null = null;
    let endWeek: {start: Date, end: Date} | null = null;
    let startIndex = -1;
    let endIndex = -1;
    
    for (let i = 0; i < monthYearData.length; i++) {
        const yearData = monthYearData[i];
        for (let j = 0; j < yearData.weeks.length; j++) {
            const week = yearData.weeks[j];
            
            if (!startWeek && startDate >= week.start && startDate <= week.end) {
                startWeek = week;
                startIndex = i * 4 + j;
            }
            
            if (!endWeek && endDate >= week.start && endDate <= week.end) {
                endWeek = week;
                endIndex = i * 4 + j;
            }
            
            if (startWeek && endWeek) break;
        }
        if (startWeek && endWeek) break;
    }
    
    if (!endWeek && startWeek) {
        const endMonth = endDate.getMonth();
        const endYear = endDate.getFullYear();
        
        const monthData = monthYearData.find(d => d.year === endYear && d.month === endMonth);
        if (monthData) {
            for (let j = monthData.weeks.length - 1; j >= 0; j--) {
                const week = monthData.weeks[j];
                if (endDate >= week.start && endDate <= week.end) {
                    endWeek = week;
                    const monthIndex = monthYearData.findIndex(d => d.year === endYear && d.month === endMonth);
                    endIndex = monthIndex * 4 + j;
                    break;
                }
            }
        }
    }
    
    if (!startWeek || !endWeek || startIndex === -1 || endIndex === -1) {
        console.warn('Could not find week range for schedule:', {
            scheduleName: schedule.scheduleName,
            startDate: schedule.startDate,
            endDate: schedule.endDate,
            foundStart: !!startWeek,
            foundEnd: !!endWeek
        });
        return { left: 0, width: 0, startIndex, endIndex };
    }
    
    const left = startIndex * TIMELINE_CONFIG.cellWidth;
    const width = (endIndex - startIndex + 1) * TIMELINE_CONFIG.cellWidth;
    
    return { left, width, startIndex, endIndex };
};

export const assignScheduleLayers = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schedules: any[],
    monthYearData: MonthYearData[]
): ScheduleWithPosition[] => {
    const schedulesWithPosition = schedules.map(schedule => ({
        schedule,
        position: calculateSchedulePosition(schedule, monthYearData)
    }));

    schedulesWithPosition.sort((a, b) => {
        if (a.position.startIndex !== b.position.startIndex) {
            return a.position.startIndex - b.position.startIndex;
        }
        return b.position.width - a.position.width;
    });

    const layers: ScheduleWithPosition[][] = [];
    
    schedulesWithPosition.forEach(item => {
        let assignedLayer = 0;
        
        while (assignedLayer < layers.length) {
            const hasOverlap = layers[assignedLayer].some(existingItem => {
                const existingEnd = existingItem.position.startIndex + 
                    (existingItem.position.width / TIMELINE_CONFIG.cellWidth) - 1;
                const currentEnd = item.position.startIndex + 
                    (item.position.width / TIMELINE_CONFIG.cellWidth) - 1;
                
                return !(currentEnd < existingItem.position.startIndex || 
                        item.position.startIndex > existingEnd);
            });
            
            if (!hasOverlap) {
                break;
            }
            assignedLayer++;
        }
        
        if (assignedLayer >= layers.length) {
            layers.push([]);
        }
        
        const scheduleWithLayer: ScheduleWithPosition = {
            schedule: item.schedule,
            position: item.position,
            layer: assignedLayer
        };
        
        layers[assignedLayer].push(scheduleWithLayer);
    });

    return layers.flat();
};

export const processSchedulesByPic = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schedules: any[],
    monthYearData: MonthYearData[]
): Record<string, ScheduleWithPosition[]> => {
    if (!schedules) return {};
    
    const groupedByPic = schedules.reduce((acc, schedule) => {
        const { pic } = schedule;
        if (!acc[pic]) {
            acc[pic] = [];
        }
        acc[pic].push(schedule);
        return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any[]>);

    const result: Record<string, ScheduleWithPosition[]> = {};
    Object.entries(groupedByPic).forEach(([pic, picSchedules]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[pic] = assignScheduleLayers(picSchedules as any[], monthYearData);
    });

    return result;
};

export const calculatePicRowHeights = (
    schedulesByPic: Record<string, ScheduleWithPosition[]>
): Record<string, number> => {
    const heights: Record<string, number> = {};
    
    Object.entries(schedulesByPic).forEach(([pic, schedulesWithLayers]) => {
        const maxLayer = Math.max(...schedulesWithLayers.map(item => item.layer), 0);
        const layerCount = maxLayer + 1;
        
        heights[pic] = Math.max(
            TIMELINE_CONFIG.baseRowHeight, 
            (layerCount * TIMELINE_CONFIG.scheduleItemHeight) + 
            ((layerCount + 1) * TIMELINE_CONFIG.scheduleSpacing)
        );
    });
    
    return heights;
};