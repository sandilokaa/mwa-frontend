'use client';

import { Bar } from 'react-chartjs-2';
import { getRecruitmentChartData } from '@/utils/recruitmentChart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: ReturnType<typeof getRecruitmentChartData>;
    title?: string;
}

export default function BarChart({ data, title }: BarChartProps) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: !!title,
                text: title,
            },
        },
    };

    return <Bar data={data} options={options} height={170} />;
}