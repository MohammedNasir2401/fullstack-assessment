"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type PieChartProps = {
    data: { periodName: string; netProfit: number }[];
};

function PieChart({ data }: PieChartProps) {
    const chartData = {
        labels: data.map((d) => d.periodName),
        datasets: [
            {
                label: "Net Profit Share",
                data: data.map((d) => Math.abs(d.netProfit)),
                backgroundColor: [
                    "#4caf50", "#ff9800", "#2196f3", "#f44336",
                    "#9c27b0", "#3f51b5", "#00bcd4", "#8bc34a",
                    "#ffc107", "#795548", "#607d8b", "#673ab7",
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return <Pie data={chartData} options={options} />;
}

export default PieChart;