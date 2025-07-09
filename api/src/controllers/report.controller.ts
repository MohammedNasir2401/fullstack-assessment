import { Request, Response } from 'express';
import logger from '../utils/logger';
import { getNumberParam } from '../utils/validations';
import { generateProfitLossReport, generateRecords } from '../services/report.service';

export async function getProfitLossReport(req: Request, res: Response): Promise<Response> {
    try {
        const page = getNumberParam(req.query.page, 1);
        const pageSize = getNumberParam(req.query.pageSize, 10);
        let source = req.query.source ? String(req.query.source) : null;
        const profitLossReport = await generateProfitLossReport(source);
        const records = await generateRecords(source, page, pageSize);

        return res.status(200).json({ profitLossReport, records, page, pageSize });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: 'Failed to generate P&L report' });
    }
}

export function healthCheck(req: Request, res: Response): void {
    logger.info('Health check');
    res.json({ status: 'ok' });
}
