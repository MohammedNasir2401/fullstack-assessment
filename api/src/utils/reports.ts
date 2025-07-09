import fs from 'fs/promises';
import path from 'path';

const categoryMap: Record<string, string> = {
    Income: 'REVENUE',
    COGS: 'COGS',
    CostofGoodsSold: 'COGS',
    Expenses: 'EXPENSES',
    OtherIncome: 'OTHER_INCOME',
    OtherExpenses: 'OTHER_EXPENSES',
    TaxExpense: 'TAX_EXPENSE'
};


export function mapGroupToCategory(rawGroup: string) {
    const category = categoryMap[rawGroup]
    if (!category) {
        return '-'
    }
    return category
}

export async function readDataFromFile(filePath: string) {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
}

export async function writeDataToFile(filePath: string, data: any) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}