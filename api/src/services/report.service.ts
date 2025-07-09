import { Prisma } from '@prisma/client';
import prisma from '../../prisma/prismaClient';
import { decimalToNumber, toTwoDecimalPlaces } from '../utils/validations';

export async function generateProfitLossReport(source: string | null) {
    let whereClause = {};
    if (source) {
        whereClause = {
            source: {
                equals: String(source)
            }
        };
    }
    const aggregatedData = await prisma.record.groupBy({
        by: ['group'],
        _sum: {
            value: true
        },
        where: {
            ...whereClause,
            group: {
                in: [
                    'REVENUE',
                    'COGS',
                    'OPERATING_EXPENSES',
                    'NON_OPERATING_EXPENSES',
                    'OTHER_INCOME',
                    'OTHER_EXPENSES',
                    'EXPENSES'
                ]
            }
        }
    });

    if (!aggregatedData || aggregatedData.length === 0) {
        return { data: {}, metrics: {} };
    }

    const result = {
        revenue: decimalToNumber(aggregatedData.find(d => d.group === 'REVENUE')?._sum?.value),
        cogs: decimalToNumber(aggregatedData.find(d => d.group === 'COGS')?._sum?.value),
        operatingExpenses: decimalToNumber(aggregatedData.find(d => d.group === 'OPERATING_EXPENSES')?._sum?.value),
        nonOperatingExpenses: decimalToNumber(aggregatedData.find(d => d.group === 'NON_OPERATING_EXPENSES')?._sum?.value),
        otherIncome: decimalToNumber(aggregatedData.find(d => d.group === 'OTHER_INCOME')?._sum?.value),
        otherExpenses: decimalToNumber(aggregatedData.find(d => d.group === 'OTHER_EXPENSES')?._sum?.value),
        expenses: decimalToNumber(aggregatedData.find(d => d.group === 'EXPENSES')?._sum?.value),

        get grossProfit() {
            return toTwoDecimalPlaces(this.revenue - this.cogs);
        },
        get operatingProfit() {
            return toTwoDecimalPlaces(this.grossProfit - this.operatingExpenses);
        },
        get netOtherIncomeExpense() {
            return toTwoDecimalPlaces(this.otherIncome - this.otherExpenses);
        },
        get profitBeforeTax() {
            return toTwoDecimalPlaces(this.operatingProfit + this.netOtherIncomeExpense - this.nonOperatingExpenses);
        },
        get netProfit() {
            return toTwoDecimalPlaces(this.profitBeforeTax - this.expenses);
        }
    };

    return {
        data: result,
        metrics: {
            grossProfit: result.grossProfit,
            operatingProfit: result.operatingProfit,
            netOtherIncomeExpense: result.netOtherIncomeExpense,
            profitBeforeTax: result.profitBeforeTax,
            netProfit: result.netProfit
        }
    };
}

export async function generateRecords(source: string | null, page: number, pageSize: number) {
    const whereClause: Prisma.RecordWhereInput = {};
    if (source) {
        whereClause.source = {
            equals: String(source)
        };
    }
    const records = await prisma.record.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: whereClause
    })
    return records
}


