type PICKey = 'RnE' | 'Vehicle Engineering' | 'System Engineering' | 'Industrial Design' | 'Testing' | 'Production' | 'Procurement';

const picMeta: Record<PICKey, { label: string; color: string; borderColor: string }> = {
    'RnE': { label: 'RnE', color: '#DBF2F2', borderColor: '#96DADA' },
    'Vehicle Engineering': { label: 'Vehicle Engineering', color: '#CDEBFF', borderColor: '#059BFF' },
    'System Engineering': { label: 'System Engineering', color: '#EBE0FF', borderColor: '#9966FF' },
    'Industrial Design': { label: 'Industrial Design', color: '#F4F5F5', borderColor: '#C9CBCF' },
    'Testing': { label: 'Testing', color: '#FDF7F2', borderColor: '#F3C5A5' },
    'Production': { label: 'Production', color: '#FEF7F6', borderColor: '#F4B9B4' },
    'Procurement': { label: 'Procurement', color: '#F8F8F6', borderColor: '#C7C4B8' },
};

export function getIssueChartData(allIssues: { pic: string, count: number }[]) {
    const countMap: Record<PICKey, number> = {
        'RnE': 0,
        'Vehicle Engineering': 0,
        'System Engineering': 0,
        'Industrial Design': 0,
        'Testing': 0,
        'Production': 0,
        'Procurement': 0,
    };

    allIssues.forEach(p => {
        const key = p.pic as PICKey;
        if (key in countMap) {
            countMap[key] += p.count;
        }
    });

    return (Object.entries(picMeta) as [PICKey, typeof picMeta[PICKey]][]).map(([key, meta]) => ({
        label: meta.label,
        value: countMap[key],
        backgroundColor: meta.color,
        borderColor: meta.borderColor,
        borderWidth: 1,
    }));
}
