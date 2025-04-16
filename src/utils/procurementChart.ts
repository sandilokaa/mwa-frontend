type ProgressKey = 'pr approved' | 'po confirmed' | 'paid' | 'delivered';

const progressMeta: Record<ProgressKey, { label: string; color: string; borderColor: string }> = {
    'pr approved': { label: 'PR Approved', color: '#DBF2F2', borderColor: '#96DADA' },
    'po confirmed': { label: 'PO Confirmed', color: '#CDEBFF', borderColor: '#059BFF' },
    'paid': { label: 'Paid', color: '#EBE0FF', borderColor: '#9966FF' },
    'delivered': { label: 'Delivered', color: '#F4F5F5', borderColor: '#C9CBCF' },
};

export function getProcurementChartData(allProcurements: { progress: string }[]) {
    const countMap: Record<ProgressKey, number> = {
        'pr approved': 0,
        'po confirmed': 0,
        'paid': 0,
        'delivered': 0,
    };

    allProcurements.forEach(p => {
        const key = p.progress.toLowerCase() as ProgressKey;
        if (key in countMap) {
            countMap[key]++;
        }
    });

    return (Object.entries(progressMeta) as [ProgressKey, typeof progressMeta[ProgressKey]][]).map(([key, meta]) => ({
        label: meta.label,
        value: countMap[key],
        backgroundColor: meta.color,
        borderColor: meta.borderColor,
        borderWidth: 1,
    }));
}
