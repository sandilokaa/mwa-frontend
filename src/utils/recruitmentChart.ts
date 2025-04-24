type ProgressKey = 'interview hr' | 'interview user' | 'interview comben' | 'offer letter';

export const progressMeta: Record<ProgressKey, { label: string; color: string; borderColor: string }> = {
    'interview hr': { label: 'Interview HR', color: '#FFE0E0', borderColor: '#FF7F7F' },
    'interview user': { label: 'Interview User', color: '#FFF4CC', borderColor: '#FFD700' },
    'interview comben': { label: 'Interview Comben', color: '#DBF2F2', borderColor: '#96DADA' },
    'offer letter': { label: 'Offer Letter', color: '#CDEBFF', borderColor: '#059BFF' },
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

    const datasets = allDivisions.map((divisionName, index) => ({
        label: divisionName,
        data: progressKeys.map(progressKey => {
            const found = allRecruitments.find(item => item.progress === progressKey);
            if (!found) return 0;
                const foundDivision = found.division.find(d => d[divisionName] !== undefined);
                return foundDivision ? foundDivision[divisionName] : 0;
        }),
        backgroundColor: Object.values(progressMeta)[index % progressKeys.length].color,
        borderColor: Object.values(progressMeta)[index % progressKeys.length].borderColor,
        borderWidth: 1,
    }));

    return {
        labels: progressKeys.map(k => progressMeta[k].label),
        datasets,
    };
}