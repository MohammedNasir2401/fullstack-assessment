import React from "react";
import {
    TableRow,
    TableCell,
    IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import TransactionsPanel from "./transactions";
import { Transaction } from "@/lib/interfaces/transaction";
import { ProfitLossData } from "@/lib/interfaces/profit-loss-data";

interface ProfitLossRowProps {
    row: ProfitLossData;
    isExpanded: boolean;
    onToggle: (id: string) => void;
    transactions: Transaction[];
    loading: boolean;
}

const ProfitLossRow: React.FC<ProfitLossRowProps> = ({ row, isExpanded, onToggle, transactions, loading }) => {
    return (
        <>
            <TableRow hover>

                <TableCell sx={{ fontSize: "12px", padding: "6px 16px" }}>{row.periodName}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.revenue}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.cogs}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.operatingExpenses}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.nonOperatingExpenses}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.otherIncome}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.otherExpenses}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.expenses}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.grossProfit}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.operatingProfit}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.netOtherIncomeExpense}</TableCell>
                <TableCell align="right" sx={{ fontSize: "12px", padding: "6px 16px" }}>$ {row.profitBeforeTax}</TableCell>
                <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: row.netProfit >= 0 ? "success.main" : "error.main", fontSize: "12px", padding: "6px 16px" }}
                >
                    $ {row.netProfit}
                </TableCell>
                <TableCell sx={{ fontSize: "12px", padding: "6px 16px" }}>
                    <IconButton size="small" onClick={() => onToggle(row.id)}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

            </TableRow>

            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={14} sx={{ p: 2 }}>
                        <TransactionsPanel transactions={transactions} loading={loading} />
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default ProfitLossRow;
