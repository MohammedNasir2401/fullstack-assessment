export interface ProfitLossData {
    id: string;
    periodName: string;
    startDate: Date;
    endDate: Date;
    revenue: number;
    cogs: number;
    operatingExpenses: number;
    nonOperatingExpenses: number;
    otherIncome: number;
    otherExpenses: number;
    expenses: number;
    grossProfit: number;
    operatingProfit: number;
    netOtherIncomeExpense: number;
    profitBeforeTax: number;
    netProfit: number;
}