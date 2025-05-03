'use client';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FC } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartData = {
    label: string;
    value: number;
    backgroundColor: string;
    borderWidth?: number;
}[];

interface DoughnutChartProps {
    data: DoughnutChartData;
    title?: string;
}

const DoughnutChart: FC<DoughnutChartProps> = ({ data, title }) => {
    const chartData = {
        labels: data.map(d => d.label),
        datasets: [
            {
                label: title ?? 'Data',
                data: data.map(d => d.value),
                backgroundColor: data.map(d => d.backgroundColor),
                borderWidth: data.map(d => d.borderWidth ?? 0),
            },
        ],
    };
    
    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };
    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;