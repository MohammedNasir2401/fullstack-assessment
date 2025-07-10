import React from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { Transaction } from "@/lib/interfaces/transaction";
import { Chip } from "@mui/material";
import { formatString } from "@/lib/utils/format-string";

interface TransactionsPanelProps {
    transactions: Transaction[];
    loading: boolean;
}

const TransactionsPanel: React.FC<TransactionsPanelProps> = ({ transactions, loading }) => {
    if (loading) {
        return (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (transactions.length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
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
                            p: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.75,
                            borderLeft: "4px solid",
                            border: "1px solid",
                            borderColor: "lightgrey",
                            fontSize: "0.85rem",
                            borderRadius: 2,
                            backgroundColor: "background.paper",
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight={500}>
                                {tx.type}
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={tx.value >= 0 ? "success.main" : "error.main"}
                            >
                                $ {tx.value.toLocaleString()}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Chip label={formatString(tx.group)} size="small" />
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );

};

export default TransactionsPanel;
