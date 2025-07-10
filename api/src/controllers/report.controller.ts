import { Request, Response } from 'express';
import logger from '../utils/logger';
import { getNumberParam } from '../utils/validations';
import { generateProfitLossReport, generateRecords, generateMonthlyPeriods } from '../services/report.service';

export async function getProfitLossReport(req: Request, res: Response): Promise<Response> {
    try {
        let source = req.query.source ? String(req.query.source) : null;
        const datePeriods = await generateMonthlyPeriods();
        let data = [];
        for (const item of datePeriods) {
            let profitLossReportMonth = await generateProfitLossReport(source, new Date(item.startDate), new Date(item.endDate));
            if (!profitLossReportMonth) {
                continue;
            }
            data.push({
                id: item.periodName.toString().toLowerCase().replace(/\s/g, "-"),
                periodName: item.periodName,
                startDate: item.startDate,
                endDate: item.endDate,
                ...profitLossReportMonth
            });
        }
        data.reverse();
        return res.status(200).json(data);

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Failed to generate P&L report' });
    }
}

export async function getRecords(req: Request, res: Response): Promise<Response> {
    try {
        const page = getNumberParam(req.query.page, 1);
        const pageSize = getNumberParam(req.query.pageSize, 10);
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

export function healthCheck(req: Request, res: Response): void {
    logger.info('Health check');
    res.json({ status: 'ok' });
}
