import { Prisma } from '@prisma/client';
import prisma from '../../prisma/prismaClient';
import { decimalToNumber, toTwoDecimalPlaces } from '../utils/validations';

export async function generateProfitLossReport(source: string | null, startDate?: Date, endDate?: Date) {
    let whereClause: any = {};

    if (source && source != 'all') {
        whereClause.source = { equals: String(source) };
    }

    if (startDate || endDate) {
        whereClause.AND = [];

        if (startDate) {
            whereClause.AND.push({
                endDate: {
                    gte: startDate,
                },
            });
        }

        if (endDate) {
            whereClause.AND.push({
                startDate: {
                    lte: endDate,
                },
            });
        }
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
        return null;
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
    return result
}

export async function generateRecords(source?: string | null, startDate?: Date | null, endDate?: Date | null) {
    const whereClause: Prisma.RecordWhereInput = {};
    if (source) {
        whereClause.source = {
            equals: String(source)
        };
    }
    if (startDate || endDate) {
        whereClause.AND = [];
        if (startDate) {
            whereClause.AND.push({
                endDate: {
                    gte: startDate,
                },
            });
        }

        if (endDate) {
            whereClause.AND.push({
                startDate: {
                    lte: endDate,
                },
            });
        }
    }
    const records = await prisma.record.findMany({
        where: whereClause
    })
    return records
}

export async function generateMonthlyPeriods() {
    const result = await prisma.record.aggregate({
        _min: {
            startDate: true,
        },
        _max: {
            endDate: true,
        },
    });
    const periods = [];
    const current = new Date(result._min.startDate!);
    const endDate = new Date(result._max.endDate!);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    current.setDate(1);
    endDate.setDate(1);
    while (current <= endDate) {
        // Get last day of current month (UTC)
        const lastDay = new Date(Date.UTC(
            current.getUTCFullYear(),
            current.getUTCMonth() + 1,
            0,
            23, 59, 59, 999
        ));

        periods.push({
            periodName: `${monthNames[current.getUTCMonth()]} ${current.getUTCFullYear()}`,
            startDate: new Date(Date.UTC(
                current.getUTCFullYear(),
                current.getUTCMonth(),
                1
            )).toISOString(),
            endDate: lastDay.toISOString()
        });

        // Move to next month (UTC)
        current.setUTCMonth(current.getUTCMonth() + 1);
    }
    return periods;
}


