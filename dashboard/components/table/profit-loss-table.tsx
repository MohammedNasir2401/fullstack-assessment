"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { ProfitLossData } from "@/lib/interfaces/profit-loss-data";
import { Pagination, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store';
import ProfitLossHeader from "./header";
import ProfitLossRow from "./row";
import CustomSelect from "../shared/select";
import { dataSourcesSelectOptions } from "@/lib/consts/data-sources";
import RefreshIcon from "@mui/icons-material/Refresh";
import Loader from "../shared/loader";
import { fetchProfitLoss } from "@/store/profit-loss-slice";
import { fetchTransactions } from "@/store/transaction-slice";
import Error from "../shared/error";



function ProfitLossTable() {

    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector(state => state.profitLoss);
    const { mappedTransactions, loadingMap } = useAppSelector(state => state.transactions);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ProfitLossData; direction: "asc" | "desc" } | null>(null);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [defaultDataSource, setDefaultDataSource] = useState<string>("all");
    useEffect(() => {
        dispatch(fetchProfitLoss({ source: defaultDataSource }));
    }, [defaultDataSource]);



    async function handleRefresh() {
        await dispatch(fetchProfitLoss({ source: defaultDataSource }));
        setIsSnackbarOpen(true);
    }



    const toggleRow = (id: string) => {
        if (expanded === id) {
            setExpanded(null);
            return;
        }
        setExpanded(id);
        if (!mappedTransactions[id]) {
            dispatch(fetchTransactions({ id, dataSource: defaultDataSource }));
        }
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;
        const { key, direction } = sortConfig;
        return [...data].sort((a, b) => {
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
    }, [data, sortConfig]);

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
        error ?
            <Error message={error} /> :
            loading ?
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
                                            transactions={mappedTransactions[row.id] ?? []}
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
