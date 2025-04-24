'use client';

import { Bar } from 'react-chartjs-2';
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

type BarChartData = {
    label: string;
    value: number;
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
}[];

interface BarChartProps {
    data: BarChartData;
    title?: string;
}

export default function BarChart({ data, title }: BarChartProps) {
    const chartData = {
        labels: data.map(d => d.label),
        datasets: [
            {
                label: title ?? 'Data',
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.backgroundColor),
                borderColor: data.map(d => d.borderColor ?? 'transparent'),
                borderWidth: data.map(d => d.borderWidth ?? 0),
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: !!title,
                text: title,
            },
        },
    };

    return <Bar data={chartData} options={options} height={170}/>;
}
