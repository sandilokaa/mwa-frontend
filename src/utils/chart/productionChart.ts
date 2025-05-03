type ProgressKey = 'not yet' | 'on going' | 'done';

const progressMeta: Record<ProgressKey, { label: string; backgroundColor: string; }> = {
    'not yet': { label: 'Not Yet', backgroundColor: '#F87171' },
    'on going': { label: 'On Going', backgroundColor: '#60A5FA' },
    'done': { label: 'Done', backgroundColor: '#34D399' },
};

export function getProductionChartData(allProductions: { productionStatus: string, count: number }[]) {
    const countMap: Record<ProgressKey, number> = {
        'not yet': 0,
        'on going': 0,
        'done': 0,
    };

    allProductions.forEach(p => {
        const key = p.productionStatus.toLowerCase() as ProgressKey;
        if (key in countMap) {
            countMap[key] += p.count;
        }
    });

    return (Object.entries(progressMeta) as [ProgressKey, typeof progressMeta[ProgressKey]][]).map(([key, meta]) => ({
        label: meta.label,
        value: countMap[key],
        backgroundColor: meta.backgroundColor,
    }));
}
