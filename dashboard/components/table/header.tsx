import React from "react";
import { TableHead, TableRow, TableCell, Box } from "@mui/material";
import { ProfitLossData } from "@/lib/interfaces/profit-loss-data";

interface ProfitLossHeaderProps {
    sortConfig: { key: keyof ProfitLossData; direction: "asc" | "desc" } | null;
    onSortChange: (key: keyof ProfitLossData) => void;
}

const sortableColumns: (keyof ProfitLossData)[] = [
    "periodName",
    "revenue",
    "cogs",
    "operatingExpenses",
    "nonOperatingExpenses",
    "otherIncome",
    "otherExpenses",
    "expenses",
    "grossProfit",
    "operatingProfit",
    "netOtherIncomeExpense",
    "profitBeforeTax",
    "netProfit",
];


const toTitleCase = (str: string) =>
    str
        .replace(/([A-Z])/g, " $1")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();

const ProfitLossHeader: React.FC<ProfitLossHeaderProps> = ({ sortConfig, onSortChange }) => (
    <TableHead>
        <TableRow>
            {sortableColumns.map((col) => {
                const active = sortConfig?.key === col;
                const direction = active ? sortConfig.direction : undefined;

                return (
                    <TableCell
                        key={col}
                        align={col === "periodName" ? "left" : "right"}
                        onClick={() => onSortChange(col)}
                        sx={{
                            cursor: "pointer",
                            userSelect: "none",
                            fontWeight: active ? "bold" : "normal",
                            whiteSpace: "nowrap",
                            position: "relative",
                            pr: 3,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: col === "periodName" ? "flex-start" : "flex-end" }}>
                            <Box component="span" sx={{ mr: active ? 1 : 0 }}>
                                {col === "periodName" ? "Period" : col === "cogs" ? "Cost of Goods Sold" : toTitleCase(col)}
                            </Box>
                            {active && (
                                <Box
                                    component="span"
                                    sx={{
                                        fontSize: 10,
                                        transform: direction === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                                        display: "inline-block",
                                        lineHeight: 1,
                                    }}
                                >
                                    ▲
                                </Box>
                            )}
                        </Box>
                    </TableCell>
                );
            })}
            <TableCell sx={{ width: 48 }} />
        </TableRow>
    </TableHead>
);

export default ProfitLossHeader;
