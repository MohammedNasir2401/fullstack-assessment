"use client";

import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import StatCard from "@/components/dashboard/stat-card";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import PieChart from "@/components/dashboard/pie-chart";
import BarChart from "@/components/dashboard/bar-chart";
import Loader from "@/components/shared/loader";
import { RecentNetProfits } from "@/lib/interfaces/recent-net-profits";
import { ProfitLossData } from "@/lib/interfaces/profit-loss-data";
import CustomSelect from "@/components/shared/select";
import { chartPeriods } from "@/lib/consts/chart-periods";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)


interface ChartDataInterface {
    recentNetProfits: RecentNetProfits;
    data: ProfitLossData[];
}
export default function DashboardPage() {


    const [chartData, setChartData] = useState<ChartDataInterface | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [barChartMonths, setBarChartMonths] = useState(12);
    const [pieChartMonths, setPieChartMonths] = useState(12);
    const barChartData = chartData?.data.slice(0, barChartMonths);
    const pieChartData = chartData?.data.slice(0, pieChartMonths);
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const url = process.env.NEXT_PUBLIC_API_URL + '/report/chart-data';
        const res = await fetch(url, {
            cache: 'no-store',
        });
        const data: ChartDataInterface = await res.json();
        setIsLoading(false);
        if (res.ok) {
            setChartData(data);
        }
    }

    return (
        isLoading ? <Loader /> :
            <Container sx={{ marginTop: 2 }}>
                <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 40 }}>
                    <StatCard label="Net Profit" subtitle="Last Month" value={chartData!.recentNetProfits.lastMonthNetProfit} />
                    <StatCard label="Net Profit" subtitle="Last 3 Months" value={chartData!.recentNetProfits.last3MonthsNetProfit} />
                    <StatCard label="Net Profit" subtitle="Last 6 Months" value={chartData!.recentNetProfits.last6MonthsNetProfit} />
                    <StatCard label="Net Profit" subtitle="Last 9 Months" value={chartData!.recentNetProfits.last9MonthsNetProfit} />
                    <StatCard label="Net Profit" subtitle="Last 12 Months" value={chartData!.recentNetProfits.last12MonthsNetProfit} />
                </div>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "space-between",
                    }}
                >
                    <Card sx={{ flex: 1, objectFit: "cover" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", direction: "row", justifyContent: "space-between" }} >
                                <Typography variant="h6" gutterBottom>
                                    Monthly Profit Contribution

                                </Typography>
                                <CustomSelect options={chartPeriods} label="Period" value={pieChartMonths} onChange={(val: number | string) => setPieChartMonths(val as number)} />
                            </Box>
                            <Box sx={{ height: 300 }}>
                                <PieChart data={pieChartData ?? []} />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: 1, }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }} >
                                <Typography variant="h6" gutterBottom>
                                    Net Profit Growth
                                </Typography>
                                <CustomSelect options={chartPeriods} label="Period" value={barChartMonths} onChange={(val: number | string) => setBarChartMonths(val as number)} />

                            </Box>
                            <Box sx={{ height: 300 }}>
                                <BarChart data={barChartData ?? []} />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

            </Container >
    );
}
