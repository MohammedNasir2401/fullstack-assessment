"use client";

import React, { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    TableContainer,
    Table,
    TableBody,
    Tooltip,
    IconButton,
    Snackbar,
} from "@mui/material";
import { Transaction } from "@/lib/interfaces/transaction";
import { ProfitLossData } from "@/lib/interfaces/profit-loss-data";
import { Pagination, Box } from '@mui/material';

import ProfitLossHeader from "./header";
import ProfitLossRow from "./row";
import CustomSelect from "../shared/select";
import { dataSourcesSelectOptions } from "@/lib/consts/data-sources";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loader from "../shared/loader";


const fetchTransactions = async (id: string, defaultDataSource: string): Promise<Transaction[]> => {
    const params = new URLSearchParams({
        source: defaultDataSource,
        startDate: id.split("|")[0],
        endDate: id.split("|")[1],
    });
    const url = process.env.NEXT_PUBLIC_API_URL + '/report/records?' + params.toString();
    const res = await fetch(url, {
        cache: 'no-store',
    });
    const jsonData = await res.json();
    return jsonData.records ?? [];
};

function ProfitLossTable() {


    const [expanded, setExpanded] = useState<string | null>(null);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [txMap, setTxMap] = useState<Record<string, Transaction[]>>({});
    const [sortConfig, setSortConfig] = useState<{ key: keyof ProfitLossData; direction: "asc" | "desc" } | null>(null);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [defaultDataSource, setDefaultDataSource] = useState<string>("all");
    useEffect(() => {
        fetchData();
    }, [defaultDataSource]);

    const [isLoading, setIsLoading] = useState(true);
    const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([]);

    async function fetchData() {
        const params = new URLSearchParams({
            source: defaultDataSource
        });
        const url = process.env.NEXT_PUBLIC_API_URL + '/report/profit-loss?' + params.toString();
        const res = await fetch(url, {
            cache: 'no-store',

        });
        const jsonData = await res.json();
        setIsLoading(false);
        if (res.ok) {
            setProfitLossData(jsonData);
        }
    }

    async function handleRefresh() {
        await fetchData();
        setIsSnackbarOpen(true);

    }



    const toggleRow = async (id: string) => {
        if (expanded === id) {
            setExpanded(null);
            return;
        }

        setExpanded(id);

        if (!txMap[id]) {
            setLoadingMap((prev) => ({ ...prev, [id]: true }));
            const data = await fetchTransactions(id, defaultDataSource);
            setTxMap((prev) => ({ ...prev, [id]: data }));
            setLoadingMap((prev) => ({ ...prev, [id]: false }));
        }
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return profitLossData;

        const { key, direction } = sortConfig;

        return [...profitLossData].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];

            if (typeof aVal === "string" && typeof bVal === "string") {
                return direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            if (typeof aVal === "number" && typeof bVal === "number") {
                return direction === "asc" ? aVal - bVal : bVal - aVal;
            }

            if (aVal instanceof Date && bVal instanceof Date) {
                return direction === "asc" ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
            }

            return 0;
        });
    }, [profitLossData, sortConfig]);

    const handleSortChange = (key: keyof ProfitLossData) => {
        if (sortConfig?.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === "asc" ? "desc" : "asc",
            });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
    };

    return (
        isLoading ?
            <Loader /> :
            <Paper sx={{ p: 3, overflowX: "auto" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ mb: 3 }} variant="h5" gutterBottom>
                        Profit & Loss Statement
                    </Typography>
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={handleRefresh} color="primary" aria-label="refresh">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <CustomSelect label="Select the Source" onChange={(e) => { setDefaultDataSource(e as string) }} options={dataSourcesSelectOptions} value={defaultDataSource} />
                <TableContainer>
                    <Table size="small" stickyHeader>
                        <ProfitLossHeader sortConfig={sortConfig} onSortChange={handleSortChange} />
                        <TableBody>
                            {sortedData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <ProfitLossRow
                                        key={row.id}
                                        row={row}
                                        isExpanded={expanded === row.id}
                                        onToggle={toggleRow}
                                        transactions={txMap[row.id] ?? []}
                                        loading={!!loadingMap[row.id]}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={Math.ceil(sortedData.length / rowsPerPage)}
                            page={page + 1}
                            onChange={(_, value) => setPage(value - 1)}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </TableContainer>
                <Snackbar

                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={isSnackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setIsSnackbarOpen(false)}
                    message="Data Refreshed Successfully"
                />
            </Paper>

    );
};

export default ProfitLossTable;
