import { Request, Response } from 'express';
import logger from '../utils/logger';
import { getNumberParam } from '../utils/validations';
import { generateProfitLossReport, generateRecords, generateMonthlyPeriods } from '../services/report.service';
import { getNetProfitForLastNMonths } from '../utils/reports';

export async function getProfitLossReport(req: Request, res: Response): Promise<Response> {
    try {
        let source = req.query.source ? String(req.query.source) : null;
        const data = await generateReport(source);
        return res.status(200).json(data);

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Failed to generate P&L report' });
    }
}

export async function getRecords(req: Request, res: Response): Promise<Response> {
    try {
        let source = req.query.source ? String(req.query.source) : null;
        const startDate = typeof req.query.startDate === 'string'
            ? new Date(req.query.startDate)
            : null;
        const endDate = typeof req.query.endDate === 'string'
            ? new Date(req.query.endDate)
            : null;
        const records = await generateRecords(source, startDate, endDate);
        return res.status(200).json({ records });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Failed to generate records' });
    }
}

export async function getChartData(req: Request, res: Response): Promise<Response> {
    const data = await generateReport(req.query.source ? String(req.query.source) : null);
    const lastMonthNetProfit = getNetProfitForLastNMonths(data, 1);
    const last3MonthsNetProfit = getNetProfitForLastNMonths(data, 3);
    const last6MonthsNetProfit = getNetProfitForLastNMonths(data, 6);
    const last9MonthsNetProfit = getNetProfitForLastNMonths(data, 9);
    const last12MonthsNetProfit = getNetProfitForLastNMonths(data, 12);

    return res.status(200).json({
        data,
        "recentNetProfits": {
            lastMonthNetProfit, last3MonthsNetProfit, last6MonthsNetProfit, last9MonthsNetProfit, last12MonthsNetProfit
        }

    });

}

async function generateReport(source: string | null) {
    const datePeriods = await generateMonthlyPeriods();
    let data = [];
    for (const item of datePeriods) {
        let profitLossReportMonth = await generateProfitLossReport(source, new Date(item.startDate), new Date(item.endDate));
        if (!profitLossReportMonth) {
            continue;
        }
        data.push({
            id: `${new Date(item.startDate).toISOString().split("T")[0]}|${new Date(item.endDate).toISOString().split("T")[0]}`,
            periodName: item.periodName,
            startDate: item.startDate,
            endDate: item.endDate,
            ...profitLossReportMonth
        });
    }
    data.reverse();
    return data;
}
export function healthCheck(req: Request, res: Response): void {
    res.json({ status: 'ok' });
}
