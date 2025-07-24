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
import { Box, Card, CardContent, Container, Paper, Typography } from "@mui/material";
import PieChart from "@/components/dashboard/pie-chart";
import BarChart from "@/components/dashboard/bar-chart";
import Loader from "@/components/shared/loader";
import CustomSelect from "@/components/shared/select";
import { chartPeriods } from "@/lib/consts/chart-periods";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchChartData } from "@/store/chart-slice";
import Error from "@/components/shared/error";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector(state => state.chart);
    const [barChartMonths, setBarChartMonths] = useState(12);
    const [pieChartMonths, setPieChartMonths] = useState(12);

    const barChartData = data?.data.slice(0, barChartMonths);
    const pieChartData = data?.data.slice(0, pieChartMonths);

    useEffect(() => {
        dispatch(fetchChartData());
    }, []);

    return (
        loading || (!data && !error) ? <Loader /> :
            error ? <Paper sx={{ p: 3 }}>
                <Error message={error} />
            </Paper> :
                data ? <Container sx={{ marginTop: 2 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 40 }}>
                        <StatCard label="Net Profit" subtitle="Last Month" value={data!.recentNetProfits.lastMonthNetProfit} />
                        <StatCard label="Net Profit" subtitle="Last 3 Months" value={data!.recentNetProfits.last3MonthsNetProfit} />
                        <StatCard label="Net Profit" subtitle="Last 6 Months" value={data!.recentNetProfits.last6MonthsNetProfit} />
                        <StatCard label="Net Profit" subtitle="Last 9 Months" value={data!.recentNetProfits.last9MonthsNetProfit} />
                        <StatCard label="Net Profit" subtitle="Last 12 Months" value={data!.recentNetProfits.last12MonthsNetProfit} />
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
                    : <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            No Data Available
                        </Typography>
                    </Paper>
    );

}
