import React from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { Transaction } from "@/lib/interfaces/transaction";
import { Chip } from "@mui/material";
import { formatString } from "@/lib/utils/format-string";

interface TransactionsPanelProps {
    transactions: Transaction[];
    loading: boolean;
}

function TransactionsPanel({ transactions, loading }: TransactionsPanelProps) {
    if (loading) {
        return (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (transactions.length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: "center", py: 2, color: "text.secondary", fontSize: "12px" }}>
                No transactions found.
            </Typography>
        );
    }

    return (
        <Box>
            <Box
                display="grid"
                gap={2}
            >
                {transactions.map((tx, i) => (
                    <Paper
                        key={i}
                        elevation={0}
                        sx={{
                            p: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                            borderLeft: "4px solid",
                            border: "1px solid",
                            borderColor: "lightgrey",
                            fontSize: "12px",
                            borderRadius: 2,
                            backgroundColor: "background.paper",
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight={500} sx={{ fontSize: "12px" }}>
                                {tx.type}
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight="bold"
                                sx={{ fontSize: "12px" }}
                            >
                                $ {tx.value.toLocaleString()}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Chip label={formatString(tx.group)} size="small" sx={{ fontSize: "0.65rem", height: "20px" }} />
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );

};

export default TransactionsPanel;
