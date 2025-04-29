type ProgressKey = 'interview hr' | 'interview user' | 'interview comben' | 'offer letter';

export const progressMeta: Record<ProgressKey, { label: string;}> = {
    'interview hr': { label: 'Interview HR'},
    'interview user': { label: 'Interview User'},
    'interview comben': { label: 'Interview Comben'},
    'offer letter': { label: 'Offer Letter'},
};

export function getRecruitmentChartData(allRecruitments: {
    progress: string;
    division: { [divisionName: string]: number }[];
    count: number;
}[]) {
    const divisionSet = new Set<string>();

    allRecruitments.forEach(item => {
        item.division.forEach(div => {
        Object.keys(div).forEach(name => divisionSet.add(name));
        });
    });

    let allDivisions = Array.from(divisionSet);
    if (allDivisions.length === 0) {
        allDivisions = ['No Data'];
    }

    const progressKeys = Object.keys(progressMeta) as ProgressKey[];

    const divisionColors: Record<string, { color: string; borderColor: string }> = {
        'Vehicle Engineering': { color: '#FFE0E0', borderColor: '#FF7F7F' },
        'System Engineering': { color: '#FFF4CC', borderColor: '#FFD700' },
        'Industrial Design': { color: '#DBF2F2', borderColor: '#96DADA' },
        'Testing': { color: '#CDEBFF', borderColor: '#059BFF' },
    };

    const datasets = allDivisions.map((divisionName) => ({
        label: divisionName,
        data: progressKeys.map(progressKey => {
            const found = allRecruitments.find(item => item.progress === progressKey);
            if (!found) return 0;
            const foundDivision = found.division.find(d => d[divisionName] !== undefined);
            return foundDivision ? foundDivision[divisionName] : 0;
        }),
        backgroundColor: divisionColors[divisionName]?.color ?? '#CCCCCC',
        borderColor: divisionColors[divisionName]?.borderColor ?? '#999999',
        borderWidth: 1,
    }));

    return {
        labels: progressKeys.map(k => progressMeta[k].label),
        datasets,
    };
}