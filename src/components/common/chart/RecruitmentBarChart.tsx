'use client';

import { Bar } from 'react-chartjs-2';
import { getRecruitmentChartData } from '@/utils/chart/recruitmentChart';
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

    const maxValue = Math.max(...data.datasets[0].data);
    const yMax = Math.ceil(maxValue + 2);

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
        scales: {
            y: {
                ticks: {
                    callback: function (value: string | number) {
                        const numericValue = Number(value);
                        return Number.isInteger(numericValue) ? numericValue : '';
                    },
                    stepSize: 1,
                },
                beginAtZero: true,
                suggestedMax: yMax
            },
        }
    };

    return <Bar data={data} options={options} height={170} />;
}