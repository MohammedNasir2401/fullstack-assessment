import { Router, Request, Response } from 'express';
import { getProfitLossReport, healthCheck, getRecords, getChartData } from '../controllers/report.controller';

const router = Router();

router.get('/profit-loss', getProfitLossReport);
router.get('/records', getRecords);
router.get('/chart-data', getChartData);

router.get('/health', healthCheck);

export default router;
