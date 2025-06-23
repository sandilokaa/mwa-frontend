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

export default function ProjectBarChart({ data, title }: BarChartProps) {
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

    const maxValue = Math.max(...data.map(d => d.value));
    const yMax = Math.ceil(maxValue + 2);

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

    return <Bar data={chartData} options={options} height={170}/>;
}
