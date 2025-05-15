type EngineeringKey = 'not yet' | 'on going' | 'done';

const statusMeta: Record<EngineeringKey, { label: string; backgroundColor: string }> = {
    'not yet': { label: 'Not Yet', backgroundColor: '#F87171' },
    'on going': { label: 'On Going', backgroundColor: '#60A5FA' },
    'done': { label: 'Done', backgroundColor: '#34D399' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEngineeringChartData(data: { [key: string]: any }[], key: 'status3D' | 'status2D' | 'statusDXF') {
    const countMap: Record<EngineeringKey, number> = {
        'not yet': 0,
        'on going': 0,
        'done': 0,
};

    data.forEach(item => {
        const status = item[key]?.toLowerCase() as EngineeringKey;
        if (status in countMap) {
        countMap[status] += item.count;
        }
    });

    return (Object.entries(statusMeta) as [EngineeringKey, typeof statusMeta[EngineeringKey]][]).map(([k, meta]) => ({
        label: meta.label,
        value: countMap[k],
        backgroundColor: meta.backgroundColor,
    }));
}
