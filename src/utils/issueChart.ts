type PICKey = 'Rne Issue' | 'Vehicle Engineering Issue' | 'System Engineering Issue' | 'Industrial Design Issue' | 'Testing Issue' | 'Production Issue' | 'Procurement Issue';

const picMeta: Record<PICKey, { label: string; color: string; borderColor: string }> = {
    'Rne Issue': { label: 'Rne Issue', color: '#DBF2F2', borderColor: '#96DADA' },
    'Vehicle Engineering Issue': { label: 'Vehicle Engineering Issue', color: '#CDEBFF', borderColor: '#059BFF' },
    'System Engineering Issue': { label: 'System Engineering Issue', color: '#EBE0FF', borderColor: '#9966FF' },
    'Industrial Design Issue': { label: 'Industrial Design Issue', color: '#F4F5F5', borderColor: '#C9CBCF' },
    'Testing Issue': { label: 'Testing Issue', color: '#FDF7F2', borderColor: '#F3C5A5' },
    'Production Issue': { label: 'Production Issue', color: '#FFF8F2', borderColor: '#F1D6B8' },
    'Procurement Issue': { label: 'Procurement Issue', color: '#F5F3FF', borderColor: '#D3C8F1' },
};

export function getIssueChartData(allIssues: { pic: string, count: number }[]) {
    const countMap: Record<PICKey, number> = {
        'Rne Issue': 0,
        'Vehicle Engineering Issue': 0,
        'System Engineering Issue': 0,
        'Industrial Design Issue': 0,
        'Testing Issue': 0,
        'Production Issue': 0,
        'Procurement Issue': 0,
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
