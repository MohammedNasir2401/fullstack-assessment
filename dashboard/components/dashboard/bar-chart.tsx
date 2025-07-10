"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = {
    data: { periodName: string; netProfit: number }[];
};

function BarChart({ data }: BarChartProps) {
    const chartData = {
        labels: [...data].reverse().map((d) => d.periodName),
        datasets: [
            {
                label: "Net Profit",
                data: [...data].reverse().map((d) => d.netProfit),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return <Bar data={chartData} options={options} />;
}
export default BarChart;